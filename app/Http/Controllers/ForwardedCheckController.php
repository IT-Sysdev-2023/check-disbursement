<?php

namespace App\Http\Controllers;

use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForwardedCheckController extends Controller
{
    
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);
        $defaultCheck = $filters['selectedCheck'] ?? 'cv';

        $chequeRecords = self::chequeRecords($filters, $defaultCheck);

        $receiver = [
            [
                'value' => 0,
                'label' => 'Accounting Dibursement CEBU'
            ],
        ];
        
        return Inertia::render('forwardCheckReleasing', [
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

    public function update(CheckStatus $id, Request $request){
        $id->update(['received_by' => $request->user()->id]);
        return redirect()->back()->with(['status' => true, 'message' => 'Save Successfully!']);
    }

    private static function chequeRecords($filters, $defaultCheck)
    {
        $loader = $defaultCheck === 'cv'
            ? fn() => self::cvRecords($filters)
            : fn() => self::crfRecords($filters);

        return $loader();
    }

    private static function cvRecords(?array $filters)
    {
        return CvCheckPayment::with('cvHeader', 'borrowedCheck', 'checkStatus', 'company', 'tagLocation')
            ->whereHas('checkStatus', function ($query) {
                $query->where(['status' => 'forward', 'received_by' => null]);
            })
            ->filter($filters)
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function crfRecords(?array $filters)
    {
        return Crf::with('borrowedCheck', 'checkStatus')
            ->whereHas('checkStatus', function ($query) {
                $query->where(['status' => 'forward', 'received_by' => null]);
            })
            ->filter($filters)
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();
    }
}
