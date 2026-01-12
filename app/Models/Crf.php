<?php

namespace App\Models;

use App\Helpers\NumberHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Crf extends Model
{
    protected $guarded = [];
    protected $table = 'crfs';

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
        ];

    }

    protected function getLocation(): Attribute
    {
        return new Attribute(
            get: fn() => $this->tagLocation?->location,
        );
    }
    protected function getCompany(): Attribute
    {
        return new Attribute(
            get: fn() => $this->company,
        );
    }
    protected function formattedAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => NumberHelper::currency($this->amount),
        );
    }
    public function scopeFilter(Builder $builder, $filters)
    {
        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'crf',
                'company',
                'no',
                'paid_to',
                'particulars',
                'amount',
                'ck_no'
            ], 'LIKE', '%' . $search . '%');
        })
            ->when($filters['sort'] ?? null, function (Builder $query, $sort) {
                $field = Str::snake($sort['field']);
                $direction = $sort['sort'];

                $table = $query->getModel()->getTable();

                if (Schema::hasColumn($table, $field)) {
                    return $query->orderBy($field, $direction);
                }

                return $query;
            });
        ;
    }

    public function tagLocation()
    {
        return $this->belongsTo(TagLocation::class);
    }

    public function borrowedCheck()
    {
        return $this->morphOne(BorrowedCheck::class, 'checkable');
    }
    public function checkStatus()
    {
        return $this->morphOne(CheckStatus::class, 'checkable');
    }
}
