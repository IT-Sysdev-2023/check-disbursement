<?php

namespace App\Helpers;

use App\Models\CvCheckPayment;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class Calendar
{

    public static function calendar()
    {
        $data = self::distinctMonths();

        $records = [];
        foreach ($data as $key => $value) {
            $date = Date::createFromFormat('Y-m', $key);
            $records[] = self::transformCalendarData($date, $value);
        }

        return $records;
    }
    private static function distinctMonths()
    {
        // $crf = Crf::select('cv_headers.cv_date', DB::raw('count(*) as total'))
        //         ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
        //         ->doesntHave('checkStatus')
        //         ->groupBy('cv_headers.cv_date')
        //         ->get()
        //         ->groupBy(
        //             fn($date) =>
        //             Date::parse($date->cv_date)->format('Y-m')
        //         );

        $cv = CvCheckPayment::select('cv_headers.cv_date', DB::raw('count(*) as total'))
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->doesntHave('checkStatus')
            ->groupBy('cv_headers.cv_date')
            ->get()
            ->groupBy(
                fn($date) =>
                Date::parse($date->cv_date)->format('Y-m')
            );

        

        return $cv;
    }


    public static function transformCalendarData($date, $records)
    {
        $startDate = (clone $date)->startOfMonth();
        $endDate = (clone $date)->endOfMonth();

        $totalDay = CarbonPeriod::create($startDate, $endDate);

        $transformers = collect($totalDay)->map(function ($val) use ($records) {

            $findRecord = $records->first(function ($record) use ($val) {
                return Date::parse($record['cv_date'])->format('Y-m-d') === $val->format('Y-m-d');
            });

            return ['day' => $val->day, 'totalRecord' => $findRecord ? $findRecord->total : 0, 'isCurrent' => false]; //$val->day === today()->day

        });

        // dd($transformers);
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
        ];

    }
}