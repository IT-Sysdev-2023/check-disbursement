<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class ColumnResolver
{
    public const DEFAULT_COLUMNS = [
        'location',
        'company',
        'borrowers.name',
        'borrower no',
        'approvers.name',
        'cheque_statuses.status',
        'receivers name',
        'cheque_date'
    ];

    public const TYPE_COLUMNS = [
        'cv' => [
            'cv no',
            'cv date',
            'cheque number',
            'cheque amount',
            'payee',
        ],
        'crf' => [
            'crf',
            'cheque amount',
            'cheque number',
            'payee',
            'bank',
            'prepared by',

        ],
    ];

    public static function resolve(?array $types): Collection
    {
        return collect(self::DEFAULT_COLUMNS)
            ->merge(
                collect($types)
                    ->intersect(array_keys(self::TYPE_COLUMNS))
                    ->flatMap(fn($type) => self::TYPE_COLUMNS[$type])
            )
            ->unique()
            ->values();
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
            fn($value) => Str::snake($value),
            $type
        );
    }
}