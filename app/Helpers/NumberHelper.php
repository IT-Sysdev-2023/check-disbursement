<?php

namespace App\Helpers;

use Illuminate\Support\Number;

class NumberHelper
{
    public static function format(mixed $number, int $scale =2): string
    {
        return number_format($number, $scale);
    }
    public static function percentage($current, $total)
    {
        if ($total == 0) {
            return 0;
        }
        $percent = ($current / $total) * 100;
        return (float) self::format($percent, 0);
    }

     public static function currency(float $amount, $locale = 'en_PH', string $currency = 'PHP')
    {
        // $numberFormatter = new NumberFormatter($locale, NumberFormatter::CURRENCY);
        // return $numberFormatter->formatCurrency($amount, $currency);
        return Number::currency($amount, in: $currency, locale: $locale);
    }
}