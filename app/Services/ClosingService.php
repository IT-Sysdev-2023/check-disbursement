<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Models\ChequeStatus;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClosingService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);


        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheck', 'tagLocation']])
            ->where('is_closed', false)
            ->whereNot('status', 'cancel')
            ->has('chequeForwardedStatus')
            ->get();

        $cheques = ChequeStatus::
            with(['checkable' => ['borrowedCheck', 'tagLocation']])
            ->where('is_closed', false)
            ->whereNot('status', 'cancel')
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('status', 'forwarded')
                        ->has('chequeForwardedStatus');
                })
                    ->orWhere('status', '!=', 'forwarded');
            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        // dd($cheques);
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
}