<?php

namespace App\Services;

use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ScannedRecords;
use App\Services\PermissionService;
use Date;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;
class StatusService
{
    public function checkStatus(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'tab']);
        $tab = $filters['tab'] ?? 'all';
        $staleThreshold = Date::today()->subMonths(6);

        // $updateToStale = BorrowedCheck::query()
        //     ->with('checkable')
        //     ->whereNotNull('approver_id')
        //     ->whereHas(
        //         'checkable',
        //         fn(Builder $q) => $q->scanRecords()
        //     )
        // ->whereHasMorph(
        //         'checkable',
        //         [CvCheckPayment::class, Crf::class],
        //         function (Builder $query, string $type) use ($staleThreshold) {
        //             $column = $type === CvCheckPayment::class ? 'check_date' : 'resolved_check_date';

        //             $query->where($column, '<', $staleThreshold);
        //         }
        //     )
        //     ->whereDoesntHaveMorph(
        //         'checkable',
        //         [CvCheckPayment::class, Crf::class],
        //         fn($query) => $query->has('checkStatus')
        //     )->get();
        // ->each(function ($check) {
        //     $check->checkable->checkStatus->update(['status' => 'staled']);
        // });

        // dd($updateToStale);

        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MATE!
        $cheque = BorrowedCheck::query()
            ->filter($filters)
            ->with('checkable.checkStatus.checkForwardedStatus')
            ->where(function (Builder $q) use ($tab) {
                if ($tab === 'all') {
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                        $q->whereNotNull('approver_id')
                            ->whereHasMorph(
                                'checkable',
                                [CvCheckPayment::class, Crf::class],
                                function (Builder $q, string $type) {
                                $column = $type === CvCheckPayment::class ? 'cv_check_payments.check_date' : 'resolved_check_date';
                                $q->scanRecords()->where($column, '>', Date::today()->subMonths(6));
                            }
                            )
                            ->whereDoesntHaveMorph(
                                'checkable',
                                [CvCheckPayment::class, Crf::class],
                                fn($query) => $query->has('checkStatus')
                            )

                        ;

                    });
                } else if ($tab === 'staled') {
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (STALE CHECKS)
                        $q->whereNotNull('approver_id')
                            ->whereHas(
                                'checkable',
                                fn(Builder $q) => $q->scanRecords()
                            )
                            ->whereHasMorph(
                                'checkable',
                                [CvCheckPayment::class, Crf::class],
                                function (Builder $query, string $type) {
                                $column = $type === CvCheckPayment::class ? 'check_date' : 'resolved_check_date';
                                $query->where($column, '<', Date::today()->subMonths(6))
                                    ->whereDoesntHave('checkStatus', function ($q) {
                                        $q->where('status', 'cancelled');
                                    });
                            }
                            )
                        ;

                    });

                } else {
                    $q->orWhere(function (Builder $q) use ($tab) { // GET ALL THE CHEQUES STORED IN check_status table and in forwarded check status
                        $q->whereHasMorph(
                            'checkable',
                            [CvCheckPayment::class, Crf::class],
                            fn(Builder $q) => $q->when(
                                auth()->user()->hasRole('regional_officer'),

                                function ($query, $tab) {
                                $query->has('checkStatus.checkForwardedStatus')
                                    ->when($tab === 'released', function ($q) {
                                        $q->whereRelation('checkStatus.checkForwardedStatus', 'status', 'released');
                                    });
                            },
                                function ($query) use ($tab) {
                                $query->whereRelation('checkStatus', 'status', $tab);
                            }
                            )

                                ->has('checkStatus')
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
                'tab' => $tab,
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