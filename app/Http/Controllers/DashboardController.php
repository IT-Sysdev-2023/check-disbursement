<?php

namespace App\Http\Controllers;

use App\Models\BorrowedCheck;
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

        $filters = $request->only(['tab']);
        $cvMax = Date::parse(CvCheckPayment::max('created_at'))->format('Y-m-d');
        $cv = CvCheckPayment::
            with('cvHeader', 'businessUnit')
            ->whereDate('created_at', $cvMax)
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        $crfMax = Date::parse(Crf::max('created_at'))->format('Y-m-d');
        $crf = Crf::whereDate('created_at', $crfMax)
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();


        $raw = CvHeader::select(
            DB::raw('MONTH(cv_date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->where('cv_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $countCvForMonths = CvHeader::where('cv_date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();

        $countCrfForMonths = Crf::where('date', '>=', Date::now()->subMonths(6)->startOfMonth())
            ->count();

        $months = $raw->pluck('month')->map(function ($m) {
            $date = Date::createFromFormat('m', $m);
            return $date->format('M');
        });

        $cvCount = CvCheckPayment::count();
        $crfCount = Crf::count();
        $checks = self::checkStatus($filters['tab'] ?? 'all');

        return Inertia::render($request->user()->hasRole('viewing') ? 'viewingDashboard' : 'dashboard', [
            'checks' => $checks,
            'cv' => $cv,
            'crf' => $crf,
            'totals' => (object) [
                'cv' => (string) $cvCount,
                'crf' => (string) $crfCount,
                'total' => (string) ($cvCount + $crfCount),
            ],
            'chart' => (object) [
                'months' => $months,
                'totals' => $raw->pluck('total'),
                'countCv' => (string) $countCvForMonths,
                'countCrf' => (string) $countCrfForMonths
            ]

        ]);
    }

    private static function checkStatus($tab)
    {
        //THIS IS WHERE IT GETS CONFUSING SO PAY ATTENTION MAYTE!
        return BorrowedCheck::query()
            ->with('checkable.checkStatus.checkForwardedStatus')
            ->where(function (Builder $q) use ($tab) {

                if ($tab === 'staled') {
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

}
