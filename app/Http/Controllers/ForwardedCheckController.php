<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Helpers\ModelHelper;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\CheckForwardedStatus;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ForwardedCheckController extends Controller
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);
        $defaultCheck = $filters['selectedCheck'] ?? 'cv';

        $chequeRecords = CheckStatus::select('id', 'checkable_id', 'checkable_type', 'status')
            ->with(['checkable' => ['cvHeader', 'borrowedCheck', 'checkStatus', 'company', 'tagLocation']])
            ->whereHas('checkable.checkStatus', function ($query) {
                $query->where(['status' => 'forward', 'received_by' => null]);
            })
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        $receiver = [
            [
                'value' => 0,
                'label' => 'Accounting Dibursement CEBU'
            ],
        ];

        return Inertia::render('forwardedCheck', [
            'cheques' => $chequeRecords,
            'defaultCheck' => $defaultCheck,
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

    public function cancelForwarded(CheckStatus $id, Request $request)
    {
        $request->validate([
            'reason' => 'required | string'
        ]);

        $id->checkForwardedStatus()
            ->create([
                'status' => 'cancel',
                'cancelled_reason' => $request->reason,
                'caused_by' => $request->user()->id
            ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Save Successfully!']);
    }
    public function update(CheckStatus $id, Request $request)
    {
        $id->update(['received_by' => $request->user()->id]);
        return redirect()->back()->with(['status' => true, 'message' => 'Save Successfully!']);
    }

    public function showForwarded(string $id, string $status)
    {
        return Inertia::render('checkReleasing/releaseCheckForwarded', [
            'id' => $id,
            'status' => $status,
            'label' => Str::title($status) . ' Check'
        ]);
    }

    public function storeReleaseCheck(CheckStatus $id, Request $request)
    {
        $validated = $request->validate([
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
            'status' => 'required|string',
        ]);

        if (CheckForwardedStatus::where('check_status_id', $id->id)->exists()) {
            return redirect()->back()->with(['status' => false, 'message' => 'Duplicate entry in check forward status']);
        }

        $handleFiles = $this->handleFiles($validated, $id->id);

        $checkStatus = $id
            ->checkForwardedStatus()
            ->create([
                'status' => Str::lower($validated['status']),
                'receivers_name' => $validated['receiversName'],
                'image' => $handleFiles->imagePath,
                'signature' => $handleFiles->signaturePath,
                'caused_by' => $request->user()->id,
            ]);
            
        $checkCompany = $checkStatus->load('checkStatus.checkable')->checkStatus->checkable->getCompany;
        $location = $checkStatus->load('checkStatus.checkable.tagLocation')->checkStatus->checkable?->getLocation;

        $label = StringHelper::statusPastTense($validated['status']);

        $data = [
            'transactionNo' => NumberHelper::padLeft($checkStatus->id),
            'items' => [
                [
                    'dateLabel' => 'Date ' . $label . ':',
                    'dateReleased' => $checkStatus->created_at->format('M d, Y H:i A'),

                    'causedLabel' => $label . ' By:',
                    'causedBy' => $validated['receiversName'],

                    'company' => $checkCompany,
                    'location' => $location,
                ]
            ]
        ];

        $stream = $this->fileHandler
            ->inFolder('pdfs/releasing/' . $label . '/')
            ->createFileName($checkStatus->id, $request->user()->id, '.pdf')
            ->handlePdf($data, 'releasingPdf');

        return redirect()->route('forwarded-releasing')->with(['status' => true, 'stream' => $stream]);
    }

    public function fowardedReleasing(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);
        $defaultCheck = $filters['selectedCheck'] ?? 'cv';

        $chequeRecords = CheckStatus::select('id', 'checkable_id', 'checkable_type', 'status')
            ->with(['checkable' => ['cvHeader', 'borrowedCheck', 'checkStatus', 'company', 'tagLocation']])
            ->whereHas('checkable.checkStatus', function ($query) {
                $query->where(['status' => 'forward'])
                    ->whereNotNull('received_by');
            })
            ->doesntHave('checkForwardedStatus')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('forwardedCheckReleasing', [
            'cheques' => $chequeRecords,
            'defaultCheck' => $defaultCheck,
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

    private function handleFiles(array $validated, string $id)
    {
        $userId = auth()->user()->id;

        $signaturePath = $this->fileHandler
            ->inFolder($validated['status'] . "/forwardedSignatures")
            ->createFileName($id, $userId, '.png')
            ->saveSignature($validated['signature']);

        $imagePath = $this->fileHandler
            ->inFolder($validated['status'] . "/forwardedImages")
            ->createFileName($id, $userId, '.png')
            ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath
        ];
    }

}
