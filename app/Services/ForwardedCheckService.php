<?php

namespace App\Services;

use App\Models\CheckStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ForwardedCheckService
{
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
}