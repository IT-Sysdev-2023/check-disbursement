<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class BorrowedCheck extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

    public function scopeFilter(Builder $builder, array $filters): Builder
    {
        return $builder
            // ->when(
            //     isset($filters['tab']) && $filters['tab'] !== 'all',
            //     function (Builder $query) use ($filters) {
            //         $query->whereHas('checkable.checkStatus', function (Builder $q) use ($filters) {
            //             $q->where('status', $filters['tab']);
            //         });
            //     }
            // )
            ->when($filters['search'] ?? null, function ($query, $search) use ($filters) {
                $query->whereHasMorph(
                    'checkable',
                    [Crf::class, CvCheckPayment::class],
                    function ($q, $type) use ($filters) {
                        $q->filter($filters);
                    }
                );
            });
    }


    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function approver()
    {
        return $this->belongsTo(Approver::class);
    }

    public function checkable()
    {
        return $this->morphTo();
    }
}
