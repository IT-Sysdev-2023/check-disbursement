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
    public function borrowedCheck()
    {
        return $this->hasOne(BorrowedCheck::class, 'check_id')->where('check', 'crf');
    }
    public function checkStatus()
    {
        return $this->hasOne(CheckStatus::class, 'check_id')->where('check', 'crf');
    }
    public function cancelledCheck()
    {
        return $this->hasOne(CancelledCheck::class);
    }
     public function tagLocation(){
        return $this->belongsTo(TagLocation::class);
    }
}
