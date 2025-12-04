<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\CvHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $cvMax = Date::parse(CvCheckPayment::max('created_at'))->format('Y-m-d');
        $cv = CvCheckPayment::
            with('cvHeader', 'company')
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

        return Inertia::render('dashboard', [
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
}
