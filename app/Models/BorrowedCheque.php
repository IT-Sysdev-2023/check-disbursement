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

    //  protected function approver(): Attribute
    // {
    //     return new Attribute(
    //         get: fn() => $this->secondary_approver_id ? $this->secondaryApprover?->name : $this->primaryApprover?->name,
    //     );
    // }

    public function scopeFilter(Builder $builder, array $filters): Builder
    {
        return $builder->whereHasMorph(
            'checkable',
            [Crf::class, Cv::class],
            function ($q, $type) use ($filters) {
                $q->filter($filters);
            }
        );
        ;
    }

    public function scopeExcludeForwarded(Builder $builder)
    {
        return $builder->whereHasMorph(
            'checkable',
            [Cv::class, Crf::class],
            fn($q) => $q->whereNotIn('tag_location_id', [1, 2]) //Exclude Cebu and Manila
        );
    }

    protected function scopeRegionalPermission(Builder $query): void
    {
        $query->where(function ($query) {

            $user = auth()->user();
            $locations = [];

            if ($user->hasPermissionTo('access cebu')) {
                $locations[] = 'Cebu';
            }

            if ($user->hasPermissionTo('access manila')) {
                $locations[] = 'Manila';
            }


            $query->whereHasMorph(
                'checkable',
                [Cv::class, Crf::class],
                function ($morphQuery) use ($locations) {
                    $morphQuery->whereHas('tagLocation', function ($locationQuery) use ($locations) {
                        $locationQuery->whereIn('location', $locations);
                    });
                }
            );

        });
    }

    public function scannedRecord()
    {
        return $this->hasOne(ScannedRecords::class);
    }

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function approver()
    {
        return $this->belongsTo(Approver::class);
    }
    // public function primaryApprover()
    // {
    //     return $this->belongsTo(Approver::class, 'primary_approver_id');
    // }
    // public function secondaryApprover()
    // {
    //     return $this->belongsTo(Approver::class, 'secondary_approver_id');
    // }

    public function checkable()
    {
        return $this->morphTo();
    }
}
