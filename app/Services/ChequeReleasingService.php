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
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\ReceiverName;
use App\Services\PermissionService;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
class ChequeReleasingService
{
    public function __construct(protected FileHandler $fileHandler, protected ReleasingService $releasingService)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'company']);

        $chequeRecords = BorrowedCheque::
            select(
                'scanned_records.batch_reference',
                DB::raw('COUNT(scanned_records.id) as cheque_count'),
                DB::raw('MIN(scanned_records.supplier) as supplier'),
                DB::raw('MIN(scanned_records.scan_method) as method')
            )
            ->excludeForwarded() // exclude Manila and Cebu
            ->whereNot('approver_id', null)
            ->join('scanned_records', 'borrowed_cheques.id', 'scanned_records.borrowed_cheque_id')

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
        $filters = $request->only(['bank']);
        return Inertia::render('chequeRegister', [
            'banks' => self::banks(),
            'filters' => [
                'bank' => $filters['bank'] ?? null,
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
        ]);

        $userId = $request->user()->id;

        return DB::transaction(function () use ($validated, $userId) {

            $overlaps = ChequeRegister::where(
                'bank_id',
                $validated['bank']
            )
                ->whereRaw('CAST(cheque_from AS UNSIGNED) <= ?', [$validated['max']])
                ->whereRaw('CAST(cheque_to AS UNSIGNED) >= ?', [$validated['min']])
                ->exists();

            if ($overlaps) {
                return redirect()->back()->with([
                    'status' => false,
                    'message' => 'Range already exists!',
                ]);
            }

            ChequeRegister::create([
                'bank_id' => $validated['bank'],
                'cheque_from' => $validated['min'],
                'cheque_to' => $validated['max'],
                'caused_by' => $userId,
            ]);

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Range added!',
            ]);
        });

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

    public function individualRelease(ReleasingCheckRequest $request)
    {
        $validated = $request->validated();

        $userId = $request->user()->id;
        $stream = DB::transaction(function () use ($validated, $userId) {

            $data = $this->releasingService->release($validated, $userId);

            return $this->fileHandler
                ->inFolder('pdfs/releasing/released/')
                ->createFileName('released-', $userId, '.pdf')
                ->handlePdf($data, 'releasedPdf');
        });
        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
    }

    public function storeReleaseBu(Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            'file' => 'nullable|string',
            'signature' => 'required|string',
            "selectedBu" => "required",
            "selectedCompany" => "required"
        ]);
        $userId = $request->user()->id;
        $stream = DB::transaction(function () use ($validated, $userId) {

            $data = $this->releasingService->releaseBu($validated, $userId);

            return $this->fileHandler
                ->inFolder('pdfs/releasing/releasedPerBu/')
                ->createFileName("released-{$validated['selectedCompany']}-{$validated['selectedBu']}", $userId, '.pdf')
                ->handlePdf($data, 'releasedPdf');
        });
        return redirect()->route('release-per-bu')->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
    }


    public function storeForwarded(Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            'location' => 'required',
            'file' => 'nullable|string',
            'signature' => 'required|string',
        ]);

        $location = $this->releasingService->getLocation($validated['location']);

        $getCheques = $this->releasingService->forwardQuery($location);

        if ($getCheques->isEmpty()) {
            return redirect()->back()->with(['status' => 'error', 'message' => 'No Record Found']);
        }

        $cheques = $this->releasingService->mapLocation($getCheques);
        $dateRange = $this->releasingService->getRangeTransaction($location);
        $stream = DB::transaction(function () use ($cheques, $validated, $request, $dateRange) {

            $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
            $chequesDetails = [];

            $handleFiles = $this->fileHandler->handleFiles($validated, $transactionNo);
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

                $checkable = $chequeStatus->checkable;

                $chequesDetails[] = [
                    'cv_no' => $checkable instanceof Cv
                        ? $checkable->cv_no
                        : $checkable->crf_no,
                    ...$checkable->only([
                        'cheque_number',
                        'cheque_date',
                        'payee',
                        'cheque_amount',
                    ]),
                ];
            }
            $locationTitle = Str::title($validated['location']);
            $data = [
                'cheques' => $chequesDetails,
                'dateRange' => $dateRange,
                'location' => "($locationTitle)",
                'transactionNo' => $transactionNo,

                'dateLabel' => 'Date Forwarded:',
                'dateReleased' => now()->format('M d, Y H:i A'),

                'causedLabel' => 'Released By:',
                'causedBy' => auth()->user()->name,
                'signature' => $handleFiles->signatureUri,

                'receivedLabel' => 'Received By:',
                'receivedBy' => $validated['receiversName'],

            ];

            return $this->fileHandler
                ->inFolder("exports/{$validated['location']}/")
                ->createFileName('report-', auth()->user()->id, '.pdf')
                ->handlePdf($data, 'forwardedReleasingPdf');
        });

        return redirect()->route('forwarded-releasing-viewing')->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
    }

    public function batchRelease(Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            'file' => 'nullable|string',
            'signature' => 'required|string',
            'batchReference' => 'required|string',
        ]);

        $stream = DB::transaction(function () use ($validated, $request) {

            $data = $this->releasingService->releaseAll($validated);
            return $this->fileHandler
                ->inFolder('pdfs/releasing/released/')
                ->createFileName('released-', $request->user()->id, '.pdf')
                ->handlePdf($data, 'releasedPdf');
        });

        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
    }

    public function forwardedReleasing(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'company']);

        $records = BorrowedCheque::with('checkable')
            ->regionalPermission()
            ->whereNot('approver_id', null)
            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereIn('tag_location_id', [1, 2])) // exclude Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        $receiverNames = ReceiverName::select('id', 'name as label')->get();

        return Inertia::render('forwardedCheques/forwardedReleasing', [
            'cheques' => $records,
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
            ->whereDoesntHave('chequeForwardedStatus')
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
}