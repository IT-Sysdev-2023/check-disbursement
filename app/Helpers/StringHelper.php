<?php

namespace App\Helpers;
class StringHelper{
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
}