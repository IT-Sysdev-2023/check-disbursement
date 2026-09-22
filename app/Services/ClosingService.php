<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Models\ChequeStatus;
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
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $disk = Storage::disk('cheque_share');

        $files = $disk->files('Pending Documents');

        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheque', 'tagLocation']])
            ->where(['is_closed' => false, 'has_document' => 0])
            ->whereNot('status', 'cancel')
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('status', 'forwarded')
                        ->has('chequeForwardedStatus');
                })
                    ->orWhere('status', '!=', 'forwarded');
            })
            ->filter($filters)
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('cvCrfList', [
            'cheques' => $cheques,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'totalDocuments' => count($files),
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

        return redirect()->back()->with(['status' => true, 'stream' => $stream]);

    }

    public function documents($chequeNumber, $id)
    {
        try {
            $disk = Storage::disk('cheque_share');
            $destination = "Documents/{$chequeNumber}-{$id}";

            $disk->makeDirectory($destination);

            foreach ($disk->files('Pending Documents') as $file) {
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
        $disk = Storage::disk('cheque_share');

        $folderName = "Documents/{$chequeNumber}-{$id}";

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
        $disk = Storage::disk('cheque_share');

        $path = "Documents/{$chequeNumber}-{$id}/{$filename}";

        abort_unless($disk->exists($path), 404);

        return $disk->response($path);
    }
}