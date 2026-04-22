<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheck;
use App\Models\BusinessUnit;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\CvHeader;
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
        $cv = CvHeader::query()
            ->when(isset($filters['bu']) && $filters['bu'] !== 'all', function ($q) use ($filters) {
                $q->whereHas('cvCheckPayment', fn($builder) => $builder->where('business_unit_id', $filters['bu']));
            })
            ->leftJoin('cv_check_payments', 'cv_check_payments.cv_header_id', '=', 'cv_headers.id')
            ->leftJoin('borrowed_checks', function ($join) {
                $join->on('borrowed_checks.checkable_id', '=', 'cv_check_payments.id')
                    ->where('borrowed_checks.checkable_type', '=', 'cv');
            })
            ->selectRaw('
                    DATE_FORMAT(cv_headers.cv_date, "%Y-%m") as month,
                    COUNT(DISTINCT cv_headers.id) as total,
                    COUNT(borrowed_checks.id) as borrowed_checks_count
            ')
            ->where('cv_headers.cv_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupByRaw('DATE_FORMAT(cv_headers.cv_date, "%Y-%m")')
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

        $countCvForMonths = CvHeader::where('cv_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();

        $countCrfForMonths = Crf::where('date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();
        $cvCount = CvCheckPayment::count();
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
        $checks = self::checkStatus($filters['tab'] ?? 'all');
        $total = bcadd(
            CvCheckPayment::sum('check_amount'),
            Crf::sum('amount'),
            2
        );
        return [
            'checks' => $checks,
            'totals' => (object) [
                'amount' => NumberHelper::currency($total),
                'releasedChecks' => CheckStatus::whereIn('status', ['released', 'forwarded'])->count(),
                'pending' => self::countForReleasing()
            ],
            'checkIssued' => CheckStatus::count()
        ];
    }

    private static function chequeRecords()
    {
        $cvQuery = CvCheckPayment::baseColumns();

        $crfQuery = Crf::baseColumns();


        $unionQuery = $cvQuery->unionAll($crfQuery);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
    private static function checkStatus($tab)
    {
        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MAYTE!
        return BorrowedCheck::query()
            ->with('checkable.checkStatus.checkForwardedStatus')
            ->where(function (Builder $q) use ($tab) {

                if ($tab === 'fo_releasing') { //Disable temporarily "For Releasing Tab"
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                        $q->whereNotNull('secondary_approver_id')
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
                                fn(Builder $q) =>
                                $q->when($tab !== 'all', function ($q) use ($tab) {
                                if ($tab === 'closed') {
                                    $q->whereRelation('checkStatus', 'is_closed', 1);
                                    // }else if ($tab === 'cancelled') {
                                } else {
                                    $q->whereRelation('checkStatus', function ($query) use ($tab) {
                                        $query->where('status', $tab)
                                            ->where('is_closed', 0);
                                    });
                                }
                            })
                                    ->has('checkStatus')
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
        return BorrowedCheck::query()
            ->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                $q->whereNotNull('secondary_approver_id')
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

            })->count();
    }

}
