<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
use App\Models\Company;
use App\Models\Crf;
use App\Models\Cv;
use App\Services\PermissionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClosingService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'tab', 'company']);

        $disk = Storage::disk('cheque_doc');
        $tab = $filters['tab'] ?? 'doc_required';
        $company = $filters['company'] ?? '';
        $files = $disk->files('new');

        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheque', 'tagLocation']])
            ->whereNot('status', 'cancel')
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('status', 'forwarded')
                        ->has('chequeForwardedStatus');
                })
                    ->orWhere('status', '!=', 'forwarded');
            })
            ->when(($tab == 'doc_required') ?? null, fn($q) => $q->where('has_document', false)->where('is_closed', false), fn($q) => $q->where('has_document', true))
            ->filter($filters)
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();


        return Inertia::render('cvCrfList', [
            'cheques' => $cheques,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? '',
                'search' => $filters['search'] ?? '',
                'tab' => $tab,
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'totalDocuments' => count($files),
            'businessUnits' => $company
                ? BusinessUnit::businessUnits($company)
                : [],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }


    public function close(ChequeStatus $id)
    {

        $stream = DB::transaction(function () use ($id) {
            $isSuccess = $id->update([
                'is_closed' => true,
                'closed_at' => now()
            ]);

            if ($isSuccess) {
                $data = [
                    'transactionNo' => NumberHelper::padLeft($id->id),
                    'dateForwarded' => $id->created_at->format('M d, Y H:i A'),

                    'closedBy' => auth()->user()->name,

                    'dateReceived' => $id->created_at->format('M d, Y H:i A'),

                    // 'receivedBy' => $id->receivers_name,
                ];

                return $this->fileHandler
                    ->inFolder('pdfs/releasing/closing/')
                    ->createFileName($id->id, auth()->user()->id, '.pdf')
                    ->handlePdf($data, 'closingPdf');

            }
        });

        return redirect()->back()->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);

    }

    public function documents($chequeNumber, $id)
    {
        try {
            $disk = Storage::disk('cheque_doc');
            $destination = "scanned/{$chequeNumber}-{$id}";

            $disk->makeDirectory($destination);

            foreach ($disk->files('new') as $file) {
                $filename = basename($file);

                $disk->move(
                    $file,
                    "{$destination}/{$filename}"
                );
            }
            ChequeStatus::findOrFail($id)->update(['has_document' => 1]);
            return response()->json(['status' => 'success', 'message' => "Files Successfully Assigned to $chequeNumber"]);
        } catch (Exception $e) {

        }

    }

    public function scannedDocuments()
    {
        //  $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheque', 'tagLocation']])
            ->where(['is_closed' => 1, 'has_document' => 1])
            ->whereNot('status', 'cancel')
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('status', 'forwarded')
                        ->has('chequeForwardedStatus');
                })
                    ->orWhere('status', '!=', 'forwarded');
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('scannedCheques', [
            'cheques' => $cheques,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);
    }

    public function documentImages($id, $chequeNumber)
    {
        $disk = Storage::disk('cheque_doc');

        $folderName = "scanned/{$chequeNumber}-{$id}";

        $files = $disk->files($folderName);

        $images = collect($files)
            ->map(function ($file) use ($id, $chequeNumber) {
                return [
                    'name' => basename($file),
                    'url' => route('cheques.document', [
                        'id' => $id,
                        'chequeNumber' => $chequeNumber,
                        'filename' => basename($file),
                    ]),
                ];
            })
            ->values();

        return response()->json([
            'images' => $images,
        ]);
    }

    public function document($id, $chequeNumber, $filename)
    {
        $disk = Storage::disk('cheque_doc');

        $path = "scanned/{$chequeNumber}-{$id}/{$filename}";

        abort_unless($disk->exists($path), 404);

        return $disk->response($path);
    }

    public function exportPdfBu(Request $request)
    {
        $validated = $request->validate([
            'bu' => 'required',
            'company' => 'required'
        ]);

        $company = $validated['company'];
        $bu = $validated['bu'];

        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheque', 'tagLocation']])
            ->whereNot('status', 'cancel')
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('status', 'forwarded')
                        ->has('chequeForwardedStatus');
                })
                    ->orWhere('status', '!=', 'forwarded');
            })
            ->whereHasMorph(
                'checkable',
                [Crf::class, Cv::class],
                function ($q) use ($company, $bu) {
                    $q->where('business_unit_id', $bu)
                        ->whereRelation('businessUnit.company', 'id', $company);
                }
            )
            ->where('has_document', true);


        if ($cheques->doesntExist()) {
            return redirect()->back()->with(['status' => false, 'message' => 'No Record Found']);
        }

        $userId = $request->user()->id;
        $stream = DB::transaction(function () use ($userId, $bu, $company, $cheques) {

            $bu = BusinessUnit::where('id', $bu)->value('name');
            $company = Company::where('id', $company)->value('name');

            $chequesDetails = [];
            foreach ($cheques->get() as $cheque) {
                $checkable = $cheque->checkable;

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

            $data = [
                'date' => now()->format('M d, Y H:i A'),
                'cheques' => $chequesDetails
            ];

            return $this->fileHandler
                ->inFolder('pdfs/documentUploaded/')
                ->createFileName("{$company}-{$bu}", $userId, '.pdf')
                ->handlePdf($data, 'documentUploaded');
        });
        return redirect()->route('closing-cheque')->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
    }
}