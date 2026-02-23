<?php

namespace App\Services;

use App\Helpers\AmountHelper;
use App\Models\Dtr;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Storage;


class CalendarHandler
{

    private object $module;

    private int $bankId;

    private string $title;

    private $date;

    public function module($mod)
    {
        $this->module = $mod;
        return $this;
    }

    public function title($title)
    {
        $this->title = $title;
        return $this;
    }

    public function bankId($id)
    {
        $this->bankId = $id;
        return $this;
    }

    public function transactionDate($date)
    {
        $this->date = $date;
        return $this;
    }

    public function result()
    {
        $formatDate = strtotime($this->date);

        $res = $this->module->findBankAccount($this->bankId)
            ->whereMonth('trans_date', date('m', $formatDate))
            ->whereYear('trans_date', date('Y', $formatDate))->cursor()->map(fn($dtr) => $dtr->trans_date->format('m/d/Y'));

        return $res->countBy();
    }

    public function fetchMonthlyTransaction()
    {

        $formatDate = strtotime($this->date);

        $key = $this->title . date('mY', $formatDate) . $this->bankId;

        $result = Cache::remember($key, now()->addHour(), function () {

            $dateWithRecord = self::result();

            return $dateWithRecord->toArray();

        });
        return $result;
    }

    public function getLatestTransactionDate($request)
    {  //get the latest date of Transaction
        $latestDtrTransDate = Dtr::where('bank_account_id', $this->bankId)
            ->latest('trans_date')
            ->first()->trans_date;

        return $latestDtrTransDate;
    }

    public function yearlyTransations()
    {
        $result = $this->module->findBankAccount($this->bankId)
            ->selectRaw('YEAR(trans_date) as year, MONTH(trans_date) as month')
            ->groupBy('year', 'month')
            ->cursor();

        $res = $result->groupBy('year');

        $yearCounts = collect();

        foreach ($res as $year => $items) {

            $monthsPresent = $items->pluck('month');
            $noMonths = collect(range(1, 12))->diff($monthsPresent);

            $noMonthsToDate = $noMonths->map(function ($item, $key) {
                return Date::create()->month($item)->format('F');
            });

            $balance = $this->module->findBankAccount($this->bankId)
                ->whereYear('trans_date', $year)->latest('trans_date')->value('balance_amount');

            $yearCounts[] = [
                'year' => $year,
                'percentage' => intval((count($items) / 12) * 100),
                'months' => ([
                    'first' => Date::create()->month($monthsPresent->first())->format('F'),
                    'end' => Date::create()->month($monthsPresent->last())->format('F'),
                    'emptyMonths' => $noMonthsToDate

                ]),
                'endingBalance' => AmountHelper::currency($balance),
                'length' => 24 / count($res)

            ];
        }
        return $yearCounts;
    }

    public function daysWithHoliday()
    {
        $today = today()->toImmutable();

        return Cache::remember($today->year, $today->endOfMonth(), function () use ($today) {
            try {
                $options = ['verify' => false];

                $proxy = config('app.proxy');

                $api = config('app.ph_holiday') . config('app.ph_holiday_key');

                $options = $proxy ? [...$options, 'proxy' => $proxy] : $options;

               $response = Http::withOptions($options)->timeout(3)->get($api);

                if ($response->successful()) {

                    $toJson = collect($response->json()['items']);

                    $arrayFilter = $toJson->filter(function ($item, $key) use ($today) {
                        $isPublicHoliday = $item['description'] === 'Public holiday';
                        $isSameYear = Date::parse($item['start']['date'])->isSameYear($today);
                        $isConfirmed = $item['status'] === 'confirmed';

                        return $isPublicHoliday && $isSameYear && $isConfirmed;
                    });

                    $filtered = $arrayFilter->map(function ($item) {

                        return [
                            'id' => $item['id'],
                            'title' => $item['summary'],
                            'description' => $item['description'],
                            'start' => $item['start'],
                            'end' => $item['end'],
                        ];
                    });

                    return $filtered;
                }

                return self::localHolidays($today->year);
            } catch (Exception) {
                return self::localHolidays($today->year);
            }
        });
    }


    public static function localHolidays(int $year)
    {
        $holidays = Storage::json('.holidays')[$year] ?? [];

        return collect($holidays);
    }
}