<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    public function scopeFilter(Builder $builder, $filter)
    {
        return $builder->when($filter['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'crf',
            ], 'LIKE', '%' . $search . '%');
        });
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
