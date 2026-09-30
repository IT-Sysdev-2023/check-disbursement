<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CebuManilaClerkController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded', 'received_by' => null])
            ->where(function ($query) {
                $query->whereDoesntHave('chequeForwardedStatus')
                    ->orWhereRelation(
                        'chequeForwardedStatus',
                        'status',
                        '!=',
                        'cancelled'
                    );
            })
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('CebuManilaClerk/forReceiving', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }
    public function forReceived(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded'])
            ->where(function ($query) {
                $query->whereDoesntHave('chequeForwardedStatus')
                    ->orWhereRelation(
                        'chequeForwardedStatus',
                        'status',
                        '!=',
                        'cancelled'
                    );
            })
            ->whereNotNull('received_by')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('CebuManilaClerk/forReceived', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }
    public function status(Request $request)
    {
        $filters = $request->only(['search', 'date', 'bu', 'company']);
        $company = $filters['company'] ?? 'all';

        $chequeRecords = ChequeStatus::select('id', 'checkable_id', 'checkable_type', 'status', 'created_at')
            ->with(['checkable' => ['borrowedCheque', 'businessUnit', 'tagLocation']])
            ->regionalPermission()
            ->where(['status' => 'forwarded'])
            ->whereRelation(
                'chequeForwardedStatus',
                'status',
                '!=',
                'cancelled'
            )
            ->whereNotNull('received_by')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('CebuManilaClerk/cmStatus', [
            'cheques' => $chequeRecords,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',

            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
        ]);
    }
}
