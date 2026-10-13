<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Controllers\DashboardController;
use App\Http\Requests\ReleasingCheckRequest;
use App\Http\Resources\ChequeCollection;
use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\ChequeRegister;
use App\Models\ChequeStatus;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\ReceiverName;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
class ChequeReleasingService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'company']);
        // $chequeRecords = self::releasingCheques($filters);

        $chequeRecords = BorrowedCheque::
            select(
                'scanned_records.batch_reference',
                DB::raw('COUNT(scanned_records.id) as cheque_count'),
                DB::raw('MIN(scanned_records.supplier) as supplier'),
                DB::raw('MIN(scanned_records.scan_method) as method')
            )

            ->whereNot('approver_id', null)
            ->join('scanned_records', 'borrowed_cheques.id', 'scanned_records.borrowed_cheque_id')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereNotIn('tag_location_id', [1, 2])) // exclude Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->groupBy('batch_reference')
            ->paginate(10)
            ->withQueryString();

        $receiverNames = ReceiverName::select('id', 'name as label')->get();

        // dd(
        //     (new ChequeCollection($chequeRecords))
        //         ->response()
        //         ->getData(true)
        // );
        return Inertia::render('checkReleasing', [
            'cheques' => $chequeRecords,
            'receiverNames' => $receiverNames,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'businessUnits' => isset($filters['company']) ? BusinessUnit::businessUnits($filters['company']) : [],
            'company' => PermissionService::userAssignedCompany($request->user())
        ]);
    }
    public function chequeRegistration(Request $request)
    {
        $filters = $request->only(['bank', 'bankAccount']);
        return Inertia::render('chequeRegister', [
            'banks' => self::banks(),
            'bankAccounts' => isset($filters['bank']) ? self::bankAccounts($filters['bank']) : [],
            'filters' => [
                'bank' => $filters['bank'] ?? null,
                'bankAccount' => $filters['bankAccount'] ?? null,
            ]
        ]);
    }

    private static function banks()
    {
        return Bank::select('id as value', 'name as label')
            ->orderBy('name')->get();
    }

    private static function bankAccounts($bank)
    {
        return BankAccount::select('account_no as label', 'id as value')
            ->where('bank_id', $bank)
            ->orderBy('account_no')->get();
    }

    public function chequeRegistrationStore(Request $request)
    {
        $validated = $request->validate([
            'min' => ['required', 'numeric', 'min:0'],
            'max' => ['required', 'numeric', 'min:0', 'gte:min'],
            'bank' => ['required'],
            'bank_account' => ['required']
        ]);

        ChequeRegister::create([
            'bank_account_id' => $validated['bank_account'],
            'cheque_from' => $validated['min'],
            'cheque_to' => $validated['max'],
            'caused_by' => $request->user()->id
        ]);
        return redirect()->back()->with(['status' => 'success', ',message' => 'Range Added!']);

    }

    public static function releasingCheques(array $filters = [])
    {
        $cv = Cv::
            baseColumns()
            ->doesntHave('chequeStatus')
            ->scanRecords()

            ->filter($filters)
            ->addSelect(
                'borrowed_cheques.id as borrowedCheckId',
                'borrowed_cheques.approved_at',
                'scanned_records.id as scanned_id',
                'scanned_records.batch_reference',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $crf = Crf::
            baseColumns()
            ->doesntHave('chequeStatus')
            ->scanRecords()

            ->filter($filters)
            ->addSelect(
                'borrowed_cheques.id as borrowedCheckId',
                'borrowed_cheques.approved_at',
                'scanned_records.id as scanned_id',
                'scanned_records.batch_reference',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $unionQuery = $cv->unionAll($crf);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->select('batch_reference')
            ->groupBy('batch_reference')
            ->orderByDesc(DB::raw('MAX(scanned_id)'))
            ->paginate(10)
            ->withQueryString();
    }

    public function getReleaseCheck(array $cheques, string $status)
    {
        return Inertia::render('chequeReleasing/releaseCheck', [
            'cheques' => $cheques,
            'status' => $status,
            'label' => Str::title($status) . ' Cheque'
        ]);
    }



    public function storeReleaseCheck(ReleasingCheckRequest $request)
    {
        $validated = $request->validated();

        $cheques = $validated['cheques'];

        $validatedInputs = $request->safe()->only(['status', 'signature', 'file']);
        $stream = DB::transaction(function () use ($cheques, $validated, $validatedInputs, $request) {

            $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
            $companies = [];
            $locations = [];

            $handleFiles = $this->handleFiles($validatedInputs, $transactionNo);
            foreach ($cheques as $cheque) {
                $borrowedCheque = BorrowedCheque::findOrFail($cheque['id']);
                $label = StringHelper::statusPastTense($cheque['status']);

                $chequeStatus = $borrowedCheque->checkable
                    ->chequeStatus()
                    ->create([
                        'transaction_no' => $transactionNo,
                        'status' => Str::lower($label),
                        'receiver_name' => $validated['receiversName'],
                        'image' => $handleFiles->imagePath,
                        'signature' => $handleFiles->signaturePath,
                        'caused_by' => $request->user()->id,
                    ]);

                $companies[] = $chequeStatus->checkable->getCompany;

                $locations[] = $chequeStatus->checkable?->getLocation;
            }

            $data = [
                'transactionNo' => $transactionNo,

                'dateLabel' => 'Date ' . $label . ':',
                'dateReleased' => now()->format('M d, Y H:i A'),

                'causedLabel' => 'Released By:',
                'causedBy' => auth()->user()->name,

                'receivedLabel' => 'Received By:',
                'receivedBy' => $validated['receiversName'],

                'company' => implode(', ', array_unique($companies)),
                'location' => implode(', ', array_unique($locations)),

            ];

            return $this->fileHandler
                ->inFolder('pdfs/releasing/' . $label . '/')
                ->createFileName($chequeStatus->id, $request->user()->id, '.pdf')
                ->handlePdf($data, 'releasingPdf');
        });

        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => $stream]);
    }


    public function storeReleaseCheckLocation(Request $request)
    {

        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            'location' => 'required',
            // 'file' => 'required|string',
            'signature' => 'required|string',
        ]);

        $loc = [
            'cebu' => 1,
            'manila' => 2
        ];
        $location = $loc[$validated['location']];
        
        $getCheques = BorrowedCheque::
            whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->whereHasMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->where('tag_location_id', $location)
            )
            ->get();
        if ($getCheques->isEmpty()) {
            return redirect()->back()->with(['status' => 'error', 'message' => 'No Record Found']);
        }

        $cheques = $getCheques->map(function ($cheque) {
            $location = $cheque->checkable?->getLocation;

            return [
                'id' => $cheque->id,
                'status' => match ($location) {
                    'Manila', 'Cebu' => 'Forward',
                    'Deposit' => 'Deposit',
                    default => 'Release',
                },
            ];
        })->values()->all();

        $validatedInputs = $validated;
        $data1 = self::generateCebu($location, $validated['location']);
        
        $stream = DB::transaction(function () use ($cheques, $validated, $validatedInputs, $request, $data1) {

            $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
            $companies = [];
            $locations = [];

            $handleFiles = $this->handleFiles($validatedInputs, $transactionNo);
            foreach ($cheques as $cheque) {
                $borrowedCheque = BorrowedCheque::findOrFail($cheque['id']);
                $label = StringHelper::statusPastTense($cheque['status']);

                $chequeStatus = $borrowedCheque->checkable
                    ->chequeStatus()
                    ->create([
                        'transaction_no' => $transactionNo,
                        'status' => Str::lower($label),
                        'receiver_name' => $validated['receiversName'],
                        'image' => $handleFiles->imagePath,
                        'signature' => $handleFiles->signaturePath,
                        'caused_by' => $request->user()->id,
                    ]);

                $companies[] = $chequeStatus->checkable->getCompany;

                $locations[] = $chequeStatus->checkable?->getLocation;
            }

            // dd($data1);
            $data = [
                'cheques' => $data1,
                'transactionNo' => $transactionNo,

                'dateLabel' => 'Date ' . $label . ':',
                'dateReleased' => now()->format('M d, Y H:i A'),

                'causedLabel' => 'Released By:',
                'causedBy' => auth()->user()->name,

                'receivedLabel' => 'Received By:',
                'receivedBy' => $validated['receiversName'],

                'company' => implode(', ', array_unique($companies)),
                'location' => implode(', ', array_unique($locations)),

            ];

            $this->fileHandler
                ->inFolder('pdfs/releasing/' . $label . '/')
                ->createFileName($chequeStatus->id, $request->user()->id, '.pdf')
                ->handleSavePdf($data, 'releasingPdf');

            return $this->fileHandler
                ->inFolder("exports/{$validated['location']}/")
                ->createFileName('report-', auth()->user()->id, '.pdf')
                ->handlePdf($data, 'forwardedReleasingPdf');
        });

        return redirect()->route('forwarded-releasing-viewing')->with(['status' => true, 'stream' => $stream]);
    }

    public static function generateCebu(int $location, $locationString)
    {

        $dateRange = self::getRangeTransaction($location);
        $data = BorrowedCheque::
            whereNot('approver_id', null)
            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $location)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
             ->with('checkable')
            ->get()
            ->map(fn($cheque) => [
                'cv_number' => match (get_class($cheque->checkable)) {
                    Cv::class => $cheque->checkable->cv_no,
                    Crf::class => $cheque->checkable->crf_no,
                },
                'cheque_number' => $cheque->checkable->cheque_number,
                'cheque_date' => $cheque->checkable->cheque_date->format('Y-m-d'),
                'payee' => $cheque->checkable->payee,
                'cheque_amount' => NumberHelper::currency($cheque->checkable->cheque_amount)
            ]);

        return [
            'title' => 'List of Forwarded Cheques',
            'location' => "($locationString)",
            'date' => $dateRange,
            'data' => $data
        ];
        // $stream = $this->download($dateRange, $location, $data->toArray());

        // return $stream;
    }

    private function download(string $dateRange, string $location, array $data)
    {

        $data = [
            'title' => 'List of Forwarded Cheques',
            'location' => "($location)",
            'date' => $dateRange,
            'data' => $data
        ];

        return $this->fileHandler
            ->inFolder("exports/{$location}/")
            ->createFileName('report-', auth()->user()->id, '.pdf')
            ->handlePdf($data, 'forwardedReleasingPdf');
    }

    private static function getRangeTransaction(string $location)
    {
        $dates = BorrowedCheque::
            whereNot('approver_id', null)

            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $location)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->get()
            ->pluck('checkable.tagged_at');

        $oldestDate = $dates->min();
        $latestDate = $dates->max();

        return $oldestDate && $latestDate
            ? $oldestDate->format('M d, Y') . ' - ' . $latestDate->format('M d, Y')
            : 'No dates available';
    }

    public function storeReleaseCheckAll(Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            // 'file' => 'required|string',
            'isForwarded' => 'required',
            'signature' => 'required|string',
            'cheques' => 'required|string',
        ]);

        $getCheques = BorrowedCheque::whereRelation(
            'scannedRecord',
            'batch_reference',
            $validated['cheques']
        )
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->when($request->isForwarded, function ($builder) {
                $builder->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    fn($query) => $query->whereIn('tag_location_id', [1, 2])
                );
            }, fn($builder) => $builder->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    fn($query) => $query->whereNotIn('tag_location_id', [1, 2])
                ))
            ->get();

        $cheques = $getCheques->map(function ($cheque) {
            $location = $cheque->checkable?->getLocation;

            return [
                'id' => $cheque->id,
                'status' => match ($location) {
                    'Manila', 'Cebu' => 'Forward',
                    'Deposit' => 'Deposit',
                    default => 'Release',
                },
            ];
        })->values()->all();

        $validatedInputs = $validated;
        $stream = DB::transaction(function () use ($cheques, $validated, $validatedInputs, $request) {

            $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
            $companies = [];
            $locations = [];

            $handleFiles = $this->handleFiles($validatedInputs, $transactionNo);
            foreach ($cheques as $cheque) {
                $borrowedCheque = BorrowedCheque::findOrFail($cheque['id']);
                $label = StringHelper::statusPastTense($cheque['status']);

                $chequeStatus = $borrowedCheque->checkable
                    ->chequeStatus()
                    ->create([
                        'transaction_no' => $transactionNo,
                        'status' => Str::lower($label),
                        'receiver_name' => $validated['receiversName'],
                        'image' => $handleFiles->imagePath,
                        'signature' => $handleFiles->signaturePath,
                        'caused_by' => $request->user()->id,
                    ]);

                $companies[] = $chequeStatus->checkable->getCompany;

                $locations[] = $chequeStatus->checkable?->getLocation;
            }

            $data = [
                'transactionNo' => $transactionNo,

                'dateLabel' => 'Date ' . $label . ':',
                'dateReleased' => now()->format('M d, Y H:i A'),

                'causedLabel' => 'Released By:',
                'causedBy' => auth()->user()->name,

                'receivedLabel' => 'Received By:',
                'receivedBy' => $validated['receiversName'],

                'company' => implode(', ', array_unique($companies)),
                'location' => implode(', ', array_unique($locations)),

            ];

            return $this->fileHandler
                ->inFolder('pdfs/releasing/' . $label . '/')
                ->createFileName($chequeStatus->id, $request->user()->id, '.pdf')
                ->handlePdf($data, 'releasingPdf');
        });

        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => $stream]);
    }

    public function forwardedReleasing(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'company']);
        // $chequeRecords = self::releasingCheques($filters);

        $chequeRecords = BorrowedCheque::
            select(
                'scanned_records.batch_reference',
                DB::raw('COUNT(scanned_records.id) as cheque_count'),
                DB::raw('MIN(scanned_records.supplier) as supplier'),
                DB::raw('MIN(scanned_records.scan_method) as method')
            )

            ->whereNot('approver_id', null)
            ->join('scanned_records', 'borrowed_cheques.id', 'scanned_records.borrowed_cheque_id')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereIn('tag_location_id', [1, 2])) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->groupBy('batch_reference')
            ->paginate(10)
            ->withQueryString();

        $receiverNames = ReceiverName::select('id', 'name as label')->get();

        // dd(
        //     (new ChequeCollection($chequeRecords))
        //         ->response()
        //         ->getData(true)
        // );
        return Inertia::render('forwardedCheques/forwardedReleasing', [
            'cheques' => $chequeRecords,
            'receiverNames' => $receiverNames,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'businessUnits' => isset($filters['company']) ? BusinessUnit::businessUnits($filters['company']) : [],
            'company' => PermissionService::userAssignedCompany($request->user())
        ]);
    }

    public function receiving(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded', 'received_by' => null])
            ->where(function ($query) {
                $query->whereDoesntHave('chequeForwardedStatus')
                    ->orWhereRelation(
                        'chequeForwardedStatus',
                        'status',
                        '!=',
                        'cancelled'
                    );
            })
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('cebuManilaClerk/forReceiving', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }
    public function received(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at', 'received_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded'])
            ->where(function ($query) {
                $query->whereDoesntHave('chequeForwardedStatus')
                    ->orWhereRelation(
                        'chequeForwardedStatus',
                        'status',
                        '!=',
                        'cancelled'
                    );
            })
            ->whereNotNull('received_by')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('cebuManilaClerk/forReceived', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }
    public function released(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded'])
            ->whereRelation(
                'chequeForwardedStatus',
                'status',
                '!=',
                'cancelled'
            )
            ->whereNotNull('received_by')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('cebuManilaClerk/cmStatus', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }


    private function handleFiles(array $validated, string $transactionNo)
    {
        $userId = auth()->user()->id;
        $uuid = Str::uuid();

        // $signaturePath = $this->fileHandler
        //     ->inFolder($transactionNo . "/signatures")
        //     ->createFileName($uuid, $userId, '.png')
        //     ->saveSignature($validated['signature']);

        // $imagePath = $this->fileHandler
        //     ->inFolder($transactionNo . "/images")
        //     ->createFileName($uuid, $userId, '.png')
        //     ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => '$signaturePath',
            'imagePath' => '$imagePath'
        ];
    }
}