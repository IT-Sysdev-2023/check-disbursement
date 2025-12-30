<?php

namespace App\Helpers;

class StringHelper
{
    public static function statusLocation($status)
    {

        $locations = [
            'Cebu' => 'Forward',
            'Manila' => 'Forward',
            'Internal' => 'Internal',
            'Deposit' => 'Deposit',
            'Tagbilaran Pick-up' => 'Release',
        ];

        return $locations[$status] ?? null;
    }

    public static function statusPastTense($status)
    {

        $label = [
            'Release' => 'Released',
            'Forward' => 'Forwarded',
            'Deposit' => 'Deposited',
            'Stale' => 'Staled',
            'Cancel' => 'Cancelled',
        ];

        return $label[$status] ?? null;
    }

  
}