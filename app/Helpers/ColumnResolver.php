<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class ColumnResolver
{
    public const DEFAULT_COLUMNS = [
        'CV/CRF No',
        'Cheque Number',
        'Cheque Amount',
        'Cheque Date',
        'Payee',
        'Location',
        'Business Unit',
        'Borrower Name',
        'Borrower No',
        'Approver Name',
        'Receiver Name',
    ];

    // public const TYPE_COLUMNS = [
    //     'cv' => [
    //         'cv no',
    //         'cv date',
    //         'cheque number',
    //         'cheque amount',
    //         'payee',
    //     ],
    //     'crf' => [
    //         'crf',
    //         'cheque amount',
    //         'cheque number',
    //         'payee',
    //         'bank',
    //         'prepared by',

    //     ],
    // ];

    public static function resolve(?array $types)
    {
        return self::DEFAULT_COLUMNS;
        // return collect(self::DEFAULT_COLUMNS)
        //     ->merge(
        //         collect($types)
        //             ->intersect(array_keys(self::TYPE_COLUMNS))
        //             ->flatMap(fn($type) => self::TYPE_COLUMNS[$type])
        //     )
        //     ->unique()
        //     ->values();
    }

    public static function statusColumnEnums()
    {
        $column = DB::selectOne("SHOW COLUMNS FROM `cheque_statuses` WHERE Field = 'status'");

        $enumValues = [];

        if ($column) {
            preg_match("/^enum\('(.*)'\)$/", $column->Type, $matches);
            if (isset($matches[1])) {
                $enumValues = explode("','", $matches[1]);
            }
        }

        return collect($enumValues)->values()->map(fn($status, $key) => [
            'label' => $status,
            'value' => $key + 1,
        ]);
    }

    public static function transformColumn($type)
    {
        return array_map(
            fn($value) => $value === 'CV/CRF No' ? 'no' : Str::snake($value),
            $type
        );
    }
}