<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessUnit extends Model
{
    protected $guarded = [];

    public static function businessUnits(int|string $company)
    {
        return self::query()
            ->when($company !== 'all', fn($q) => $q->whereHas(
                'company',
                fn($q) =>
                $q->where('id', $company)
            ))
            ->pluck('name', 'id')
            ->map(fn($label, $value) => compact('label', 'value'))
            ->values()
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ]);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function navDatabases()
    {
        return $this->hasOne(NavDatabase::class);
    }
}
