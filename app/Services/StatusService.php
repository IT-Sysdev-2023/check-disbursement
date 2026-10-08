<?php

namespace App\Services;

use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Models\ScannedRecords;
use App\Services\PermissionService;
use Date;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;
class StatusService
{
    public function chequeStatus(Request $request)
    {
        $filters = $request->only(['company', 'search', 'sort', 'date', 'tab']);
        $tab = $filters['tab'] ?? 'for_releasing';
        $staleThreshold = Date::today()->subMonths(6);

        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MAYTE!
        $cheque = BorrowedCheque::query()
            ->filter($filters)
            ->with('checkable.chequeStatus.chequeForwardedStatus')

            ->where(function (Builder $q) use ($tab) {
                if ($tab === 'for_releasing') { // "For Releasing Tab"
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                        $q->whereNotNull('approver_id')
                            ->has('scannedRecord')
                            ->whereDoesntHaveMorph(
                                'checkable',
                                [Cv::class, Crf::class],
                                fn($query) => $query->has('chequeStatus')
                            )

                        ;

                    });
                } else if ($tab === 'staled') {
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (STALE CHECKS)
                        $q->whereNotNull('approver_id')
                            ->has('scannedRecord')
                            ->whereHasMorph(
                                'checkable',
                                [Cv::class, Crf::class],
                                function (Builder $query, string $type) {
                                $column = $type === Cv::class ? 'cvs.cheque_date' : 'crfs.cheque_date';
                                $query->where($column, '<', Date::today()->subMonths(6))
                                    ->whereDoesntHave('chequeStatus', function ($q) {
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
                            [Cv::class, Crf::class],
                            fn(Builder $q) =>
                                $q->when(
                                    auth()->user()->hasRole('regional_officer'),

                                    function ($query) use ($tab) { // CEBU/ MANILA tabs
                                    $query->has('chequeStatus.chequeForwardedStatus')
                                        ->when($tab === 'released', fn($q) =>
                                            $q->whereRelation('chequeStatus.chequeForwardedStatus', 'status', 'released'), fn($query) =>
                                                $query->whereRelation('chequeStatus', 'status', $tab));
                                },
                                    function ($query) use ($tab) {
                                    $query->whereRelation('chequeStatus', 'status', $tab)
                                        ->where(function ($q) use ($tab) {
                                            $q->whereRelation('chequeStatus', 'status', $tab)
                                                ->when($tab === 'forwarded', fn($q) =>
                                                    $q->whereHas('chequeStatus', fn($q) => $q->whereNotNull('received_by')));
                                        });
                                }
                                )
                                    ->has('chequeStatus')
                        );
                    });
                }

            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
        $company = $filters['company'] ?? 'all';
        return Inertia::render('chequeStatus', [
            'cheques' => $cheque,
            'filter' => (object) [
                'selectedBu' => $company,
                'search' => $filters['search'] ?? '',
                'tab' => $tab,
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'businessUnits' => BusinessUnit::businessUnits($company),
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => 'all'
            ]),
        ]);
    }

    public function scannedRecordsAmountCheckNo(Request $request)
    {

        $validated = $request->validate([
            'amount' => 'required|string',
            'chequeNo' => 'required|string'
        ]);
        //WALA MO DISPLAY SA SCANNED DETAILS? WALA NA MA SCAN NGA CHEQUE SA CHEQUE STATUS
        $data = ScannedRecords::where('amount', $validated['amount'])
            ->where('cheque_no', $validated['chequeNo'])
            ->first();

        return response()->json(new ScannedRecordResource($data));
    }

    public function scannedRecords(ScannedRecords $id)
    {
        return response()->json(new ScannedRecordResource($id));
    }
}