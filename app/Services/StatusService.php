<?php

namespace App\Services;

use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ScannedRecords;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;
class StatusService
{
    public function checkStatus(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'tab']);

        $cheque = BorrowedCheck::query()
            ->filter($filters)
            ->with('checkable.checkStatus.checkForwardedStatus')
            ->where(function (Builder $q) use ($filters) {
                $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                    $q->whereNotNull('approver_id')
                        ->whereHas(
                            'checkable',
                            fn(Builder $q) => $q->scanRecords()
                        )
                        ->whereDoesntHaveMorph(
                            'checkable',
                            [CvCheckPayment::class, Crf::class],
                            fn($query) => $query->has('checkStatus')
                        );
                });
                if (isset($filters['tab']) && $filters['tab'] !== 'all') {
                    $q->orWhere(function (Builder $q) { // GET ALL THE CHEQUES STORED IN check_status table
                        $q->whereHasMorph(
                            'checkable',
                            [CvCheckPayment::class, Crf::class],
                            fn(Builder $q) => $q->when(auth()->user()->hasRole('regional_officer'), function ($query) {
                            $query->has('checkStatus.checkForwardedStatus');
                        })->has('checkStatus')
                        );
                    });
                }

            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('checkStatus', [
            'cheques' => $cheque,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'tab' => $filters['tab'] ?? 'all',
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

    public function scannedRecordsAmountCheckNo(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|string',
            'checkNo' => 'required|string'
        ]);
        $data = ScannedRecords::where('amount', $validated['amount'])
            ->where('check_no', $validated['checkNo'])
            ->first();

        return response()->json(new ScannedRecordResource($data));
    }

    public function scannedRecords(ScannedRecords $id)
    {
        return response()->json(new ScannedRecordResource($id));
    }
}