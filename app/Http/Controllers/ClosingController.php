<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $cheques = CheckStatus::with('checkable.borrowedCheck')
            ->where('is_closed', false)
            ->whereNot('status', 'cancel')
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

        $stream = DB::transaction(function () use ($id) {
            $isSuccess = $id->update([
                'is_closed' => true,
                'closed_at' => now()
            ]);

            if ($isSuccess) {
                $data = [
                    'transactionNo' => NumberHelper::padLeft($id->id),
                    'items' => [
                        [
                            'dateForwarded' => $id->created_at->format('M d, Y H:i A'),

                            'forwardedBy' => "",

                            'dateReceived' => '',

                            'receivedBy' => '',
                        ]
                    ]
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
