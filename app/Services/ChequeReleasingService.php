<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
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
        $chequeRecords = ChequeService::manageChecks($filters);

        // dd(
        //     (new ChequeCollection($chequeRecords))
        //         ->response()
        //         ->getData(true)
        // );
        return Inertia::render('checkReleasing', [
            'cheques' => new ChequeCollection($chequeRecords),
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

    public function getReleaseCheck(array $ids, string $status)
    {
        return Inertia::render('chequeReleasing/releaseCheck', [
            'id' => $ids,
            'status' => $status,
            'label' => Str::title($status) . ' Check'
        ]);
    }



    public function storeReleaseCheck(ReleasingCheckRequest $request)
    {
        $validated = $request->validated();

        $ids = $validated['ids'];

        $validatedInputs = $request->safe()->only(['status', 'signature', 'file']);

        $stream = DB::transaction(function () use ($ids, $validated, $validatedInputs, $request) {

            $transaction = now()->format('YmdHis') . '-' . auth()->id();
            $companies = [];
            $locations = [];
            $label = StringHelper::statusPastTense($validated['status']);
          
            $handleFiles = $this->handleFiles($validatedInputs);
            foreach ($ids as $id) {
                $borrowedCheque = BorrowedCheque::findOrFail($id);

                $chequeStatus = $borrowedCheque->checkable
                    ->chequeStatus()
                    ->create([
                        'transaction_no' => $transaction,
                        'status' => Str::lower($label),
                        'receivers_name' => $validated['receiversName'],
                        'image' => $handleFiles->imagePath,
                        'signature' => $handleFiles->signaturePath,
                        'caused_by' => $request->user()->id,
                    ]);

                $companies[] = $chequeStatus->checkable->getCompany;

                $locations[] = $chequeStatus->checkable?->tagLocation?->location;
            }

            $data = [
                'transactionNo' => $transaction,

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

    private function handleFiles(array $validated)
    {
        $userId = auth()->user()->id;
        $uuid = Str::uuid();

        $signaturePath = $this->fileHandler
            ->inFolder(Str::lower($validated['status']) . "/signatures")
            ->createFileName($uuid, $userId, '.png')
            ->saveSignature($validated['signature']);

        $imagePath = $this->fileHandler
            ->inFolder(Str::lower($validated['status']) . "/images")
            ->createFileName($uuid, $userId, '.png')
            ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath
        ];
    }
}