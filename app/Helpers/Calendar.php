<?php

namespace App\Helpers;

use App\Models\Crf;
use App\Models\Cv;
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
        $page = $filters['page'] ?? 1;
        $perPage = $filters['perPage'] ?? 3; // BUs per page
        
        // if (isset($filters['isNavSelected']) && $filters['isNavSelected'] == 'true') {
        //     //  Nav selected: use nav records only, don't merge with base
        //     $data = self::distinctMonthsNav($filters['monthDetails']);
        // } else {
            //  Normal: use base data only
            $data = self::distinctMonths($filters['company'] ?? null);
        // }

        $total = $data->count();
        $data = $data->slice(($page - 1) * $perPage, $perPage);


        $navDetails = self::getNavConnectionDetails($data);
        $records = collect();

        foreach ($data as $bu => $cheques) {

            $groupdByDate = $cheques->groupBy(
                fn($q) => Date::parse($q->date)->format('Y-m')
            );

            $monthlyData = collect();

            foreach ($groupdByDate as $groupedMonthYear => $value) {

                $nav = $navDetails[$value->first()->buId] ?? null;

                if (!is_null($nav)) {
                    $totalNavRecords = (new GenerateCvService())
                        ->setConnection($nav->navServer, $nav->name)
                        ->countNavRecords($nav->navHeaderTable->name, $groupedMonthYear);

                    $date = Date::createFromFormat('!Y-m', $groupedMonthYear);

                    $monthlyData->put(
                        $groupedMonthYear,
                        self::transformCalendarData($date, $value, $totalNavRecords)
                    );
                }

            }

            $records->push([
                'business_unit' => $bu,
                'months' => $monthlyData->toArray(),
            ]);
        }
        return [
            // 'data' => [],
            // 'meta' => [
            //     'current_page' => 1,
            //     'per_page' => 1,
            //     'total' => 1,
            //     'last_page' => 1,
            // ]
            'data' => $records->toArray(),
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => ceil($total / $perPage),
            ]
        ];
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
                $nav->navHeaderTable->name,
                $details['month'],
                $details['year']
            );

        return $totalNavRecords;
    }
    private static function distinctMonths($company)
    {
        $result = Cv::query()
            ->join('business_units', 'business_units.id', '=', 'cvs.business_unit_id')
            ->where('business_units.company_id', '<>', 13)
            ->when($company && $company !== 'all', function ($q) use ($company) {
                $q->where('business_units.company_id', $company);
            })
            ->selectRaw("
        cvs.cv_date as date,
        business_units.name as business_unit,
        business_units.id as buId,
        0 as crf_total,
        COUNT(*) as cv_total,
        COUNT(*) as total,
        MAX(cvs.created_at) as latest_created_at
    ")
            ->groupBy(
                'cvs.cv_date',
                'business_units.name',
                'business_units.id'
            )
            ->orderByDesc('latest_created_at')
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
            ];

        });

        $totalDay = $transformers->toArray();
        $startWeek = $startDate->dayOfWeek;

        for ($i = 0; $i < $startWeek; $i++) {
            array_unshift($totalDay, ['day' => "", 'holiday' => null, 'isCurrent' => false]);
        }

        $totalMontly = $records->sum('total');
        return [
            'month' => (clone $date)->format('M Y'),
            'y' => (clone $date)->year,
            'm' => (clone $date)->month,
            'days' => array_chunk($totalDay, 7),
            'totalMonthly' => $totalMontly,
            'businessUnit' => $records->first()->business_unit ?? null,
            'totalNavRecords' => $navRecords - $totalMontly

        ];

    }
}