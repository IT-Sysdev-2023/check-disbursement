<?php

namespace App\Helpers;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
class ColumnResolver
{
    public const DEFAULT_COLUMNS = [
        'location',
        'company',
        'borrowers.name',
        'borrower no',
        'approvers.name',
        'check_statuses.status',
        'receivers name',
    ];

    public const TYPE_COLUMNS = [
        'cv' => [
            'cv no',
            'cv date',
            'check number',
            'check amount',
            'payee',
        ],
        'crf' => [
            'crf',
            'amount',
            'paid to',
            'bank',
            'ck no',
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
        $column = DB::selectOne("SHOW COLUMNS FROM `check_statuses` WHERE Field = 'status'");

        $enumValues = [];

        if ($column) {
            preg_match("/^enum\('(.*)'\)$/", $column->Type, $matches);
            if (isset($matches[1])) {
                $enumValues = explode("','", $matches[1]);
            }
        }

        return $enumValues;
    }
}