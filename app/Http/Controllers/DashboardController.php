<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['tab', 'bu', 'bank', 'bankAccount', 'search']);
        if ($request->user()->hasRole('viewing')) {
            return Inertia::render(
                'viewingDashboard',
                self::viewingDashboard($filters)
            );
        }

        return Inertia::render(
            'dashboard',
            self::defaultDashboard($filters)
        );
    }

    private static function defaultDashboard(array $filters)
    {
        $cheques = new ChequeCollection(self::chequeRecords($filters));

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
            DB::raw('MONTHNAME(cheque_date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->where('cheque_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->groupBy(DB::raw('MONTHNAME(cheque_date)'))
            ->orderByDesc(DB::raw('MIN(MONTH(cheque_date))'))
            ->get();

        $countCvForMonths = Cv::where('cv_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();

        $countCrfForMonths = Crf::where('cheque_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();
        $cvCount = Cv::count();
        $crfCount = Crf::count();
        $bu = BusinessUnit::businessUnits('all');



        return [
            'company' => PermissionService::userAssignedCompany(Auth::user()),
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
            'bu' => $bu,
            'banks' => self::banks(),
            'bankAccounts' => isset($filters['bank']) ? self::bankAccounts($filters['bank']) : [],
            'businessUnits' => isset($filters['company']) ? BusinessUnit::businessUnits($filters['company']) : [],


            'filters' => [
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'bank' => $filters['bank'] ?? null,
                'bankAccount' => $filters['bankAccount'] ?? null,
                ...$filters
            ]
        ];
    }

    private static function viewingDashboard($filters)
    {
        $checks = self::chequeStatus($filters);
        $total = bcadd(
            Cv::whereHas('chequeStatus', fn($q) => $q->whereIn('status', ['released', 'forwarded']))->sum('cheque_amount'),
            Crf::whereHas('chequeStatus', fn($q) => $q->whereIn('status', ['released', 'forwarded']))->sum('cheque_amount'),
            2
        );
        return [
            'checks' => $checks,
            'totals' => (object) [
                'amount' => NumberHelper::currency($total),
                'releasedChecks' => ChequeStatus::whereIn('status', ['released', 'forwarded'])->count(),
                'pending' => self::countForReleasing()
            ],
            'checkIssued' => ChequeStatus::count(),
            'banks' => self::banks(),
            'bankAccounts' => isset($filters['bank']) ? self::bankAccounts($filters['bank']) : [],
            'filters' => [
                'bank' => $filters['bank'] ?? null,
                'bankAccount' => $filters['bankAccount'] ?? null,
                ...$filters
            ]
        ];
    }

    private static function banks()
    {
        return Cv::select('bank_name')
            ->distinct()
            ->orderBy('bank_name')
            ->pluck('bank_name')
            ->filter()
            ->map(fn($bank, $index) => ['value' => $index, 'label' => $bank])
            ->values()->prepend([
                    'label' => 'All',
                    'value' => 'all'
                ]);
    }

    private static function bankAccounts($bank)
    {
        return Cv::select('bank_account_no')
            ->where('bank_name', $bank)
            ->distinct()
            ->orderBy('bank_account_no')
            ->pluck('bank_account_no')
            ->filter()
            ->map(fn($bankAccount, $index) => ['value' => $index, 'label' => $bankAccount])
            ->values()->prepend([
                    'label' => 'All',
                    'value' => 'all'
                ]);
    }

    private static function chequeRecords($filters)
    {
        $cvQuery = Cv::filter($filters)->baseColumns();

        $crfQuery = Crf::filter($filters)->baseColumns();

        $unionQuery = $cvQuery->unionAll($crfQuery);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }
    private static function chequeStatus($filters)
    {
        $tab = $filters['tab'] ?? 'all';
        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MAYTE!
        return BorrowedCheque::query()
            ->with('checkable.chequeStatus.chequeForwardedStatus')
            ->where(function (Builder $q) use ($tab, $filters) {

                if ($tab === 'for_releasing') { //Disable temporarily "For Releasing Tab"
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (FOR RELEASING)
                        // $q->whereNotNull('secondary_approver_id')
                        $q->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            function (Builder $q, string $type) {
                            $column = $type === Cv::class ? 'cvs.cheque_date' : 'crfs.cheque_date';
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
                } else {
                    if ($tab === 'staled') {
                        $q->where(function (Builder $q) { // GET THE CHEQUES FROM (STALE CHECKS)
                            // $q->whereNotNull('secondary_approver_id')
                            $q->whereHas(
                                'checkable',
                                fn(Builder $q) => $q->scanRecords()
                            )
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
                        $q->orWhere(function (Builder $q) use ($tab, $filters) { // GET ALL THE CHEQUES STORED IN check_status table and in forwarded check status
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
                            })->filter($filters)
                                    ->has('chequeStatus')
                            );
                        });
                    }
                }

            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    public function chequeStatusMonitoring(Request $request)
    {
        $filters = $request->only(['company', 'search', 'sort', 'date', 'tab', 'bu']);
        $tab = $filters['tab'] ?? 'for_signature';

        $cheque = BorrowedCheque::query()
            ->filter($filters)
            ->with('checkable.chequeStatus.chequeForwardedStatus')

            ->where(function (Builder $q) use ($tab) {

                if ($tab === 'for_signature') {
                    $q->where('approver_id', null)->whereDoesntHaveMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($query) => $query->has('chequeStatus')
                    );
                } else if ($tab === 'for_releasing') {
                    $q->has('scannedRecord')->whereNotNull('approver_id')->whereDoesntHaveMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($query) => $query->has('chequeStatus')
                    );
                } else if ($tab === 'staled') {
                    $q->where(function (Builder $q) { // GET THE CHEQUES FROM (STALE CHECKS)
                        $q->whereNotNull('approver_id')
                            ->whereHas(
                                'checkable',
                                fn(Builder $q) => $q->scanRecords()
                            )
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

                } else if ($tab === 'closed') {
                    $q->whereHasMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn(Builder $q) => $q->whereRelation('chequeStatus', 'is_closed', 1)
                    );
                } else {
                    $q->orWhere(function (Builder $q) use ($tab) { // GET ALL THE CHEQUES STORED IN check_status table and in forwarded check status
                        $q->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            fn(Builder $q) =>
                            $q->whereRelation('chequeStatus.chequeForwardedStatus', 'status', $tab)
                                ->orWhereRelation('chequeStatus', 'status', $tab)
                        );
                    });
                }

            })
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
        $company = $filters['company'] ?? 'all';
        return Inertia::render('chequeStatusMonitoring', [
            'cheques' => $cheque,
            'filter' => (object) [
                'selectedCompany' => $company,
                'selectedBu' => $filters['bu'] ?? 'all',
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

    public function cancelledCheques(Request $request)
    {
        $filters = $request->only(['company', 'search', 'sort', 'date', 'tab', 'bu']);
        $cancelledCheques = ChequeStatus::with('checkable')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('viewing/cancelledCheques', [
            'cheques' => $cancelledCheques,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);
    }
    private static function countForReleasing()
    {
        return BorrowedCheque::has('scannedRecord')
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->count();
    }

}
