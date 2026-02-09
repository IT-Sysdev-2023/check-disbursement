<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\CrfService;
use App\Services\PermissionService;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Date;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class CrfController extends Controller
{

    public function __construct(protected CrfService $service)
    {

    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function extractCrf(Request $request)
    {
        return $this->service->extract($request);
    }

    // public function retrievedCrf(Request $request)
    // {
    //     return $this->service->retrievedCrf($request);
    // }

    public function detailsCrf(Crf $id)
    {
        return $this->service->detailsCrf($id);
    }

    // public function calendar()
    // {
    //     $startDate = now()->startOfMonth();
    //     $endDate = now()->endOfMonth();

    //     // $totalDay = range($startDate->day, $endDate->day);
    //     $totalDay =  CarbonPeriod::create($startDate, $endDate);

    //     $transformers = collect($totalDay)->map(function ($val) {

    //         $holidayDates = $this->daysWithHoliday();

    //         //filter holidays that are present in the current month
    //         $dates = $holidayDates->filter(function ($item, $key) {
    //             return Date::parse($item['start']['date'])->month == today()->month;
    //         })->pluck('start.date')->toArray();

    //         $isHoliday = in_array($val->format('Y-m-d'), $dates);

    //         $holiday = $isHoliday ? $holidayDates->where('start.date', $val->format('Y-m-d'))->first()['title'] : null;

    //         return ['day' => $val->day, 'holiday' => $holiday, 'isCurrent' => $val->day === today()->day];

    //     });
    //     $totalDay = $transformers->toArray();
    //     $startWeek = $startDate->dayOfWeek;

    //     for ($i = 0; $i < $startWeek; $i++) {
    //         array_unshift($totalDay, ['day' => "", 'holiday' => null, 'isCurrent' => false]);
    //     }

        
    //     return response()->json([
    //         'month' => today()->format('M Y'),
    //         'days' => array_chunk($totalDay, 7),
    //     ]);

    // }

    // public function daysWithHoliday()
    // {
    //     $today = today()->toImmutable();

    //     return Cache::remember($today->year, $today->endOfMonth(), function () use ($today) {
    //         try {
    //             $options = ['verify' => false];

    //             $proxy = config('app.proxy');

    //             $api = config('app.ph_holiday') . config('app.ph_holiday_key');

    //             $options = $proxy ? [...$options, 'proxy' => $proxy] : $options;

    //            $response = Http::withOptions($options)->timeout(3)->get($api);

    //             if ($response->successful()) {

    //                 $toJson = collect($response->json()['items']);

    //                 $arrayFilter = $toJson->filter(function ($item, $key) use ($today) {
    //                     $isPublicHoliday = $item['description'] === 'Public holiday';
    //                     $isSameYear = Date::parse($item['start']['date'])->isSameYear($today);
    //                     $isConfirmed = $item['status'] === 'confirmed';

    //                     return $isPublicHoliday && $isSameYear && $isConfirmed;
    //                 });

    //                 $filtered = $arrayFilter->map(function ($item) {

    //                     return [
    //                         'id' => $item['id'],
    //                         'title' => $item['summary'],
    //                         'description' => $item['description'],
    //                         'start' => $item['start'],
    //                         'end' => $item['end'],
    //                     ];
    //                 });

    //                 return $filtered;
    //             }

    //             return self::localHolidays($today->year);
    //         } catch (Exception) {
    //             return self::localHolidays($today->year);
    //         }
    //     });
    // }

    // public static function localHolidays(int $year)
    // {
    //     $holidays = Storage::json('.holidays')[$year] ?? [];

    //     return collect($holidays);
    // }
}
