<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

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
}
