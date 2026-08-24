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
        $perPage = $filters['perPage'] ?? 2; // BUs per page
        // $data = self::distinctMonths($filters['company'] ?? null);

        // if (isset($filters['isNavSelected']) && $filters['isNavSelected'] == 'true') {
        //     $navRecords = self::distinctMonthsNav($filters['monthDetails']);

        //     $data = $data->map(function ($item, $key) use ($navRecords) {
        //         return $navRecords->has($key) ? $navRecords->get($key) : $item;
        //     });
        // }
        if (isset($filters['isNavSelected']) && $filters['isNavSelected'] == 'true') {
            //  Nav selected: use nav records only, don't merge with base
            $data = self::distinctMonthsNav($filters['monthDetails']);
        } else {
            //  Normal: use base data only
            $data = self::distinctMonths($filters['company'] ?? null);
        }

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
        $crf = Crf::select('cheque_date as date', 'business_units.name as business_unit', 'business_units.id as buId', DB::raw('count(*) as total'), DB::raw("'CRF' as type"),  DB::raw('MAX(crfs.created_at) as created_at'))
            ->join('business_units', 'business_units.id', '=', 'crfs.business_unit_id')
            ->whereNot('business_units.company_id', 13)
            ->when($company && $company != 'all', function ($q) use ($company) {
                $q->whereHas('businessUnit', function ($q) use ($company) {
                    $q->where('company_id', $company);
                });
            })
            // ->doesntHave('checkStatus')
            ->groupBy('date', 'business_units.name', 'business_units.id');

        $cv = Cv::select('cv_date as date', 'business_units.name as business_unit', 'business_units.id as buId', DB::raw('count(*) as total'), DB::raw("'CV' as type"),  DB::raw('MAX(cvs.created_at) as created_at'))
            ->join('business_units', 'business_units.id', '=', 'cvs.business_unit_id')
             ->whereNot('business_units.company_id', 13)
            ->when($company && $company != 'all', function ($q) use ($company) {
                $q->whereHas('businessUnit', function ($q) use ($company) {
                    $q->where('company_id', $company);
                });
            })
            // ->doesntHave('checkStatus')
            ->groupBy('cv_date', 'business_units.name', 'business_units.id');


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
            SUM(total) as total,
            MAX(created_at) as latest_created_at
        ")
            ->groupBy('date', 'business_unit', 'buId')
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