<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\ModelHelper;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\BorrowedCheck;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
class CheckReleasingService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $chequeRecords = BorrowedCheck::with('checkable.tagLocation')
            ->whereNotNull('approver_id')
            ->whereHas(
                'checkable',
                fn(Builder $query) =>
                $query->scanRecords()
            )
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('checkReleasing', [
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

    public function getReleaseCheck(string $checkId, string $status)
    {
        return Inertia::render('chequeReleasing/releaseCheck', [
            'id' => $checkId,
            'status' => $status,
            'label' => Str::title($status) . ' Check'
        ]);
    }

    public function storeReleaseCheck(BorrowedCheck $id, ReleasingCheckRequest $request)
    {
        $request->validated();

        $validatedInputs = $request->safe()->only(['status', 'id', 'signature', 'file']);
        $handleFiles = $this->handleFiles($validatedInputs, $id->checkable_id);

        $validated = $request->safe()->except(['signature', 'file']);


        $stream = DB::transaction(function () use ($id, $validated, $handleFiles, $request) {
            $checkStatus = $id->checkable->checkStatus()
                ->create([
                    'status' => Str::lower($validated['status']),
                    'receivers_name' => $validated['receiversName'],
                    'image' => $handleFiles->imagePath,
                    'signature' => $handleFiles->signaturePath,
                    'caused_by' => $request->user()->id,
                ]);

            $checkCompany = $checkStatus->load('checkable')->checkable->getCompany;

            $label = StringHelper::statusPastTense($validated['status']);

            $data = [
                'transactionNo' => NumberHelper::padLeft($checkStatus->id),
                'items' => [
                    [
                        'dateLabel' => 'Date ' . $label . ':',
                        'dateReleased' => $checkStatus->created_at->format('M d, Y H:i A'),

                        'causedLabel' => $label . ' By:',
                        'causedBy' => auth()->user()->name,

                        'receivedLabel' => 'Received By:',
                        'receivedBy' => $validated['receiversName'],

                        'company' => $checkCompany,
                        'location' => $checkStatus->load('checkable.tagLocation')->checkable?->tagLocation->location,
                    ]
                ]
            ];

            return $this->fileHandler
                ->inFolder('pdfs/releasing/' . $label . '/')
                ->createFileName($checkStatus->id, $request->user()->id, '.pdf')
                ->handlePdf($data, 'releasingPdf');
        });

        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => $stream]);
    }

    private function handleFiles(array $validated, int $id)
    {
        $userId = auth()->user()->id;

        $signaturePath = $this->fileHandler
            ->inFolder(Str::lower($validated['status']) . "/signatures")
            ->createFileName($id, $userId, '.png')
            ->saveSignature($validated['signature']);

        $imagePath = $this->fileHandler
            ->inFolder(Str::lower($validated['status']) . "/images")
            ->createFileName($id, $userId, '.png')
            ->saveFile($validated['file']);

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath
        ];
    }
}