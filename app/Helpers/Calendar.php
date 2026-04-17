<?php

namespace App\Helpers;

use App\Models\BusinessUnit;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\NavDatabase;
use App\Services\GenerateCvService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class Calendar
{

    public static function calendar(array $filters)
    {
        $data = self::distinctMonths($filters['company'] ?? null);
        if (isset($filters['isNavSelected']) && $filters['isNavSelected'] == 'true') {
            $navRecords = self::distinctMonthsNav($filters['monthDetails']);
            $data = $data->merge($navRecords);
        }
        $records = collect();
        $navDetails = self::getNavConnectionDetails($data);

        foreach ($data as $bu => $cheques) {

            $groupdByDate = $cheques->groupBy(
                fn($q) => Date::parse($q->date)->format('Y-m')
            );

            $monthlyData = collect();

            foreach ($groupdByDate as $groupedMonthYear => $value) {

                $nav = $navDetails[$value->first()->buId];

                $totalNavRecords = (new GenerateCvService())
                    ->setConnection($nav->navServer, $nav->name)
                    ->countNavRecords($nav->navHeaderTable->name, $groupedMonthYear);

                $date = Date::createFromFormat('!Y-m', $groupedMonthYear);

                $monthlyData->put(
                    $groupedMonthYear,
                    self::transformCalendarData($date, $value, $totalNavRecords)
                );
            }

            $records->push([
                'business_unit' => $bu,
                'months' => $monthlyData->toArray(),
            ]);
        }
        return $records->toArray();
    }

    private static function distinctMonthsNav(array $details)
    {
        $bu = $details['businessUnit'] ?? null;
        $nav = NavDatabase::with('navServer', 'navHeaderTable')
            ->whereHas('businessUnit', function ($q) use ($bu) {
                $q->where('name', $bu);
            })
            ->first();

        $totalNavRecords = (new GenerateCvService())
            ->setConnection(
                $nav->navServer,
                $nav->name
            )
            ->navRecords(
                $nav->business_unit_id,
                $bu,
                $nav->navHeaderTable->name,
                $details['month'],
                $details['year']
            );

        return $totalNavRecords;
    }

    public static function getMissingRecordsNav(array $details)
    {
        $bu = $details['bu'] ?? null;
        $nav = NavDatabase::with('navServer', 'navHeaderTable')
            ->whereHas('businessUnit', function ($q) use ($bu) {
                $q->where('name', $bu);
            })
            ->first();

        $totalNavRecords = (new GenerateCvService())
            ->setConnection(
                $nav->navServer,
                $nav->name
            )
            ->getNavMissingRecords(
                $nav->business_unit_id,
                $bu,
                $nav->navHeaderTable->name,
                $details['month'],
                $details['year']
            );

        return $totalNavRecords;
    }
    private static function distinctMonths($company)
    {
        $crf = Crf::select('date as date', 'business_units.name as business_unit', 'business_units.id as buId', DB::raw('count(*) as total'), DB::raw("'CRF' as type"))
            ->join('business_units', 'business_units.id', '=', 'crfs.business_unit_id')
            ->when($company && $company != 'all', function ($q) use ($company) {
                $q->whereHas('businessUnit', function ($q) use ($company) {
                    $q->where('company_id', $company);
                });
            })
            // ->doesntHave('checkStatus')
            ->groupBy('date', 'business_units.name', 'business_units.id');

        $cv = CvCheckPayment::select('cv_headers.cv_date as date', 'business_units.name as business_unit', 'business_units.id as buId', DB::raw('count(*) as total'), DB::raw("'CV' as type"))
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->join('business_units', 'business_units.id', '=', 'cv_check_payments.business_unit_id')
            ->when($company && $company != 'all', function ($q) use ($company) {
                $q->whereHas('businessUnit', function ($q) use ($company) {
                    $q->where('company_id', $company);
                });
            })
            // ->doesntHave('checkStatus')
            ->groupBy('cv_headers.cv_date', 'business_units.name', 'business_units.id');


        $result = DB::query()
            ->fromSub(
                $crf->unionAll($cv),
                'combined'
            )
            ->selectRaw("
            date,
            business_unit,
            buId,
            SUM(CASE WHEN type = 'crf' THEN total ELSE 0 END) as crf_total,
            SUM(CASE WHEN type = 'cv' THEN total ELSE 0 END) as cv_total,
            SUM(total) as total
        ")
            ->groupBy('date', 'business_unit', 'buId')
            ->orderBy('date')
            ->get()
            ->groupBy('business_unit');
        return $result;
    }

    private static function getNavConnectionDetails($data)
    {
        $buIds = $data->map(fn($item) => $item->first()->buId)->unique();

        return NavDatabase::with('navServer', 'navHeaderTable')
            ->whereHas('businessUnit', function ($q) use ($buIds) {
                $q->whereIn('id', $buIds);
            })
            ->get()
            ->keyBy('business_unit_id');
    }


    public static function transformCalendarData(Carbon $date, Collection $records, int $navRecords)
    {
        $startDate = (clone $date)->startOfMonth();
        $endDate = (clone $date)->endOfMonth();

        $totalDay = CarbonPeriod::create($startDate, $endDate);

        $transformers = collect($totalDay)->map(function ($val) use ($records) {
            $findRecord = $records->first(function ($record) use ($val) {
                return Date::parse($record->date)->format('Y-m-d') === $val->format('Y-m-d');
            });
            return [
                'day' => $val->day,
                'isWeekend' => $val->isWeekend(),
                'totalRecord' => $findRecord ? $findRecord->total : 0,
                'crf' => $findRecord ? $findRecord->crf_total : 0,
                'cv' => $findRecord ? $findRecord->cv_total : 0,
                'isCurrent' => false
            ]; //$val->day === today()->day

        });

        $totalDay = $transformers->toArray();
        $startWeek = $startDate->dayOfWeek;

        for ($i = 0; $i < $startWeek; $i++) {
            array_unshift($totalDay, ['day' => "", 'holiday' => null, 'isCurrent' => false]);
        }

        return [
            'month' => (clone $date)->format('M Y'),
            'y' => (clone $date)->year,
            'm' => (clone $date)->month,
            'days' => array_chunk($totalDay, 7),
            'totalMonthly' => $records->sum('total'),
            'businessUnit' => $records->first()->business_unit ?? null,
            'totalNavRecords' => $navRecords

        ];

    }
}