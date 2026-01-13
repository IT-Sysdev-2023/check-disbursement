<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $cheques = CheckStatus::with(['checkable' => ['cvHeader', 'borrowedCheck']])
            ->where('is_closed', false)
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
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }


    public function close(CheckStatus $id)
    {
        $id->update([
            'is_closed' => true,
            'closed_at' => now()
        ]);


        // $data = [
        //     'transactionNo' => NumberHelper::padLeft($id->id),
        //     'items' => [
        //         [
        //             'dateForwarded' => $id->created_at->format('M d, Y H:i A'),

        //             'forwardedBy' => $validated['receiversName'],

        //             'dateReceived' => $validated['receiversName'],

        //             'receivedBy' => $id->receivers_name,
        //         ]
        //     ]
        // ];

        // $stream = $this->fileHandler
        //     ->inFolder('pdfs/releasing/' . $label . '/')
        //     ->createFileName($checkStatus->id, $request->user()->id, '.pdf')
        //     ->handlePdf($data, 'releasingPdf');

        // return redirect()->route('check-releasing')->with(['status' => true, 'stream' => $stream]);
        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}
