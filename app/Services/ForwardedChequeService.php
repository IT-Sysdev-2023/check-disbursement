<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\ChequeForwardedStatus;
use App\Models\ChequeStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
class ForwardedChequeService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date']);

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded', 'received_by' => null])
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        $receiver = [
            [
                'value' => 0,
                'label' => $request->user()->name
            ],
        ];

        return Inertia::render('forwardedCheck', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'receiver' => $receiver,
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }

    public function cancelForwarded(ChequeStatus $id, Request $request)
    {
        $request->validate([
            'reason' => 'required | string'
        ]);

        $id->chequeForwardedStatus()
            ->create([
                'status' => 'cancel',
                'cancelled_reason' => $request->reason,
                'caused_by' => $request->user()->id
            ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Save Successfully!']);
    }
    public function update(ChequeStatus $id, Request $request)
    {
        $id->update(['received_by' => $request->user()->id]);
        return redirect()->back()->with(['status' => true, 'message' => 'Save Successfully!']);
    }

    public function showForwarded(string $id, string $status)
    {
        return Inertia::render('chequeReleasing/releaseCheckForwarded', [
            'id' => $id,
            'status' => $status,
            'label' => Str::title($status) . ' Check'
        ]);
    }

    public function storeReleaseCheck(ReleasingCheckRequest $request)
    {
        $validated = $request->validated();

        $cheques = collect($validated['cheques']);

        if (
            ChequeForwardedStatus::whereIn(
                'cheque_status_id',
                $cheques->pluck('id')
            )->exists()
        ) {
            return redirect()->back()->with([
                'status' => false,
                'message' => 'Duplicate entry in cheque forward status'
            ]);
        }

        $stream = DB::transaction(function () use ($cheques, $validated, $request) {
            $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
            $companies = [];
            $locations = [];


            $handleFiles = $this->handleFiles($validated, $transactionNo);
            foreach ($cheques as $cheque) {
                $chequeStatus = ChequeStatus::where('id', $cheque['id'])->firstOrFail();
                $chequeStatus->chequeForwardedStatus()
                    ->create([
                        'status' => Str::lower($cheque['status']),
                        'forwarded_receivers_name' => $validated['receiversName'],
                        'image' => $handleFiles->imagePath,
                        'signature' => $handleFiles->signaturePath,
                        'caused_by' => $request->user()->id,
                    ]);
            }

            $companies[] = $chequeStatus->checkable->getCompany;

            $locations[] = $chequeStatus->checkable?->getLocation;

            $label = StringHelper::statusPastTense($validated['cheques'][0]['status']);

            $data = [
                'transactionNo' => $transactionNo,

                'dateLabel' => 'Date ' . $label . ':',
                'dateReleased' => $chequeStatus->created_at->format('M d, Y H:i A'),

                'causedLabel' => 'Received By:',
                'causedBy' => $validated['receiversName'],

                'releasedLabel' => 'Released By:',
                'releasedBy' => auth()->user()->name,

                'company' => implode(', ', array_unique($companies)),
                'location' => implode(', ', array_unique($locations)),

            ];

            return $this->fileHandler
                ->inFolder('pdfs/releasing/' . $label . '/')
                ->createFileName($chequeStatus->id, $request->user()->id, '.pdf')
                ->handlePdf($data, 'releasingPdf');
        });


        return redirect()->route('forwarded-releasing')->with(['status' => true, 'stream' => $stream]);
    }

    public function forwardedReleasing(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date']);
        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->where(['status' => 'forwarded'])
            ->whereNotNull('received_by')
            ->regionalPermission()
            ->doesntHave('chequeForwardedStatus')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('forwardedChequeReleasing', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }

    private function handleFiles(array $validated, string $transactionNo)
    {
        $userId = auth()->user()->id;
        $uuid = Str::uuid();

        $signaturePath = $this->fileHandler
            ->inFolder($transactionNo . "/forwardedSignatures")
            ->createFileName($uuid, $userId, '.png')
            ->saveSignature($validated['signature']);

        $imagePath = $this->fileHandler
            ->inFolder($transactionNo . "/forwardedImages")
            ->createFileName($uuid, $userId, '.png')
            ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath
        ];
    }
}