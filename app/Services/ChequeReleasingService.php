<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
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
                DB::raw('COUNT(scanned_records.id) as cheque_count')
            )
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

        // dd($chequeRecords);

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


    public function storeReleaseCheckAll(Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            // 'file' => 'required|string',
            'signature' => 'required|string',
            'cheques' => 'required|string',
        ]);

        $getCheques = BorrowedCheque::whereRelation(
            'scannedRecord',
            'batch_reference',
            $validated['cheques']
        )
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

    private function handleFiles(array $validated, string $transactionNo)
    {
        $userId = auth()->user()->id;
        $uuid = Str::uuid();

        $signaturePath = $this->fileHandler
            ->inFolder($transactionNo . "/signatures")
            ->createFileName($uuid, $userId, '.png')
            ->saveSignature($validated['signature']);

        $imagePath = $this->fileHandler
            ->inFolder($transactionNo . "/images")
            ->createFileName($uuid, $userId, '.png')
            ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath
        ];
    }
}