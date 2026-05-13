<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BorrowedCheque extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

     protected function approver(): Attribute
    {
        return new Attribute(
            get: fn() => $this->secondary_approver_id ? $this->secondaryApprover?->name : $this->primaryApprover?->name,
        );
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
                    [Crf::class, Cv::class],
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

    public function primaryApprover()
    {
        return $this->belongsTo(Approver::class, 'primary_approver_id');
    }
    public function secondaryApprover()
    {
        return $this->belongsTo(Approver::class, 'secondary_approver_id');
    }

    public function checkable()
    {
        return $this->morphTo();
    }
}
