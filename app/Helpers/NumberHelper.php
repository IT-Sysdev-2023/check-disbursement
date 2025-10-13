<?php

namespace App\Helpers;

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
}