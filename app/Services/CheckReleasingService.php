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
        // $defaultCheck = $filters['selectedCheck'] ?? 'cv';

        $chequeRecords = BorrowedCheck::with('checkable')
            ->whereNotNull('approver_id')
            ->whereHasMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                function (Builder $query) {
                    $query->scanRecords();
                }
            )
            ->doesntHave('checkable.checkStatus')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('checkReleasing', [
            'cheques' => $chequeRecords,
            // 'defaultCheck' => $defaultCheck,
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
        return Inertia::render('checkReleasing/releaseCheck', [
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
                    'causedBy' => $validated['receiversName'],

                    'receivedLabel' => 'Received By:',
                    'receivedBy' => $validated['receiversName'],

                    'company' => $checkCompany,
                    'location' => $checkStatus->load('checkable.tagLocation')->checkable?->tagLocation->location,
                ]
            ]
        ];

        $stream = $this->fileHandler
            ->inFolder('pdfs/releasing/' . $label . '/')
            ->createFileName($checkStatus->id, $request->user()->id, '.pdf')
            ->handlePdf($data, 'releasingPdf');

        return redirect()->route('check-releasing')->with(['status' => true, 'stream' => $stream]);
    }



    public function cancelCheck(BorrowedCheck $id, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $id->checkable->checkStatus()
            ->create([
                'status' => 'cancel',
                'cancelled_reason' => $request->reason,
                'caused_by' => $request->user()->id,
            ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    private static function chequeRecords(array $filters, string $defaultCheck)
    {
        $loader = $defaultCheck === 'cv'
            ? fn() => self::cvRecords($filters)
            : fn() => self::crfRecords($filters);

        return $loader();
    }

    private static function cvRecords(?array $filters)
    {
        return CvCheckPayment::with('cvHeader', 'company')
            ->withWhereHas('borrowedCheck', function ($query) {
                $query->whereNotNull('approver_id');
            })
            ->doesntHave('checkStatus')
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.amount', '=', 'cv_check_payments.check_amount')
                    ->where(function ($q) {
                        $q->where(function ($q) {
                            $q->where('cv_check_payments.check_number', '!=', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'cv_check_payments.check_number'
                                );
                        })->orWhere(function ($q) {
                            $q->where('cv_check_payments.check_number', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'assigned_check_numbers.check_number'
                                );
                        });
                    });
            })
            ->select(
                'cv_check_payments.id',
                'cv_check_payments.cv_header_id',
                'cv_check_payments.check_number',
                'cv_check_payments.check_date',
                'cv_check_payments.check_amount',
                'cv_check_payments.payee',
                'cv_check_payments.company_id',
                'cv_check_payments.tag_location_id'
            )
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function crfRecords(?array $filters)
    {
        return Crf::select('crfs.id', 'crf', 'paid_to', 'crfs.amount', 'ck_no', 'no', 'company', 'paid_to', 'tag_location_id')
            ->withWhereHas('borrowedCheck', function ($query) {
                $query->whereNotNull('approver_id');
            })
            ->doesntHave('checkStatus')
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'crfs.ck_no')
                    ->on('scanned_records.amount', '=', 'crfs.amount');
            })
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
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