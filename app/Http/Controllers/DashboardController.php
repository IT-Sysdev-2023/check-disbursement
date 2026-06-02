<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['tab', 'bu']);
        return Inertia::render(
            $request->user()->hasRole('viewing') ? 'viewingDashboard' : 'dashboard',
            $request->user()->hasRole('viewing') ? [...self::viewingDashboard($filters)] : [...self::defaultDashboard($filters)]
        );
    }

    private static function defaultDashboard($filters)
    {
        $cheques = new ChequeCollection(self::chequeRecords());
        $cv = Cv::query()
            ->when(isset($filters['bu']) && $filters['bu'] !== 'all', function ($q) use ($filters) {
                $q->whereHas('cvCheckPayment', fn($builder) => $builder->where('business_unit_id', $filters['bu']));
            })
            ->leftJoin('borrowed_cheques', function ($join) {
                $join->on('borrowed_cheques.checkable_id', '=', 'cvs.id')
                    ->where('borrowed_cheques.checkable_type', '=', 'cv');
            })
            ->selectRaw('
                    DATE_FORMAT(cv_date, "%Y-%m") as month,
                    COUNT(DISTINCT cvs.id) as total,
                    COUNT(borrowed_cheques.id) as borrowed_checks_count
            ')
            ->where('cv_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupByRaw('DATE_FORMAT(cv_date, "%Y-%m")')
            ->orderBy('month', 'desc')
            ->get();

        $crf = Crf::select(
            DB::raw('MONTHNAME(date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->where('date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->groupBy(DB::raw('MONTHNAME(date)'))
            ->orderByDesc(DB::raw('MIN(MONTH(date))'))
            ->get();

        $countCvForMonths = Cv::where('cv_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();

        $countCrfForMonths = Crf::where('date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();
        $cvCount = Cv::count();
        $crfCount = Crf::count();
        $bu = BusinessUnit::businessUnits('all');
        return [
            'cheques' => $cheques,
            'totals' => (object) [
                'cv' => (string) $cvCount,
                'crf' => (string) $crfCount,
                'total' => (string) ($cvCount + $crfCount),
            ],
            'chart' => (object) [
                'cvChart' => (object) [
                    'labels' => $cv->pluck('month'),
                    'data' => $cv->pluck('total'),
                    'borrowedChecks' => $cv->pluck('borrowed_checks_count')
                ],
                'crfChart' => (object) [
                    'labels' => $crf->pluck('month'),
                    'data' => $crf->pluck('total')
                ],

                'countCv' => (string) $countCvForMonths,
                'countCrf' => (string) $countCrfForMonths
            ],
            'bu' => $bu
        ];
    }

    private static function viewingDashboard($filters)
    {
        $checks = self::chequeStatus($filters['tab'] ?? 'all');
        $total = bcadd(
            Cv::sum('cheque_amount'),
            Crf::sum('amount'),
            2
        );
        return [
            'checks' => $checks,
            'totals' => (object) [
                'amount' => NumberHelper::currency($total),
                'releasedChecks' => ChequeStatus::whereIn('status', ['released', 'forwarded'])->count(),
                'pending' => self::countForReleasing()
            ],
            'checkIssued' => ChequeStatus::count()
        ];
    }

    private static function chequeRecords()
    {
        $cvQuery = Cv::baseColumns();

        $crfQuery = Crf::baseColumns();


        $unionQuery = $cvQuery->unionAll($crfQuery);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
    private static function chequeStatus($tab)
    {
        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MAYTE!
        return BorrowedCheque::query()
            ->with('checkable.chequeStatus.chequeForwardedStatus')
            ->where(function (Builder $q) use ($tab) {

                if ($tab === 'fo_releasing') { //Disable temporarily "For Releasing Tab"
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                        $q->whereNotNull('secondary_approver_id')
                            ->whereHasMorph(
                                'checkable',
                                [Cv::class, Crf::class],
                                function (Builder $q, string $type) {
                                $column = $type === Cv::class ? 'cvs.check_date' : 'resolved_cheque_date';
                                $q->scanRecords()->where($column, '>', Date::today()->subMonths(6));
                            }
                            )
                            ->whereDoesntHaveMorph(
                                'checkable',
                                [Cv::class, Crf::class],
                                fn($query) => $query->has('chequeStatus')
                            )

                        ;

                    });
                } else
                    if ($tab === 'staled') {
                        $q->where(function (Builder $q) { // GET THE CHEQUES FROM (STALE CHECKS)
                            $q->whereNotNull('secondary_approver_id')
                                ->whereHas(
                                    'checkable',
                                    fn(Builder $q) => $q->scanRecords()
                                )
                                ->whereHasMorph(
                                    'checkable',
                                    [Cv::class, Crf::class],
                                    function (Builder $query, string $type) {
                                    $column = $type === Cv::class ? 'cheque_date' : 'resolved_cheque_date';
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
                                $q->when($tab !== 'all', function ($q) use ($tab) {
                                if ($tab === 'closed') {
                                    $q->whereRelation('chequeStatus', 'is_closed', 1);
                                    // }else if ($tab === 'cancelled') {
                                } else {
                                    $q->whereRelation('chequeStatus', function ($query) use ($tab) {
                                        $query->where('status', $tab)
                                            ->where('is_closed', 0);
                                    });
                                }
                            })
                                    ->has('chequeStatus')
                            );
                        });
                    }

            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }
    private static function countForReleasing()
    {
        return BorrowedCheque::query()
            ->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                $q->whereNotNull('secondary_approver_id')
                    ->whereHasMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        function (Builder $q, string $type) {
                        $column = $type === Cv::class ? 'cvs.cheque_date' : 'resolved_cheque_date';
                        $q->scanRecords()->where($column, '>', Date::today()->subMonths(6));
                    }
                    )
                    ->whereDoesntHaveMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($query) => $query->has('chequeStatus')
                    )

                ;

            })->count();
    }

}
