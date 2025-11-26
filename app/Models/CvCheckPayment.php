<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CvCheckPayment extends Model
{

    protected function casts(): array
    {
        return [
            'check_date' => 'datetime',
            'clearing_date' => 'datetime',
        ];

    }

    public function scopeFilter(Builder $builder, array $filters)
    {
        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereHas('cvHeader', function (Builder $query) use ($search) {
                $query->whereAny([
                    'cv_no',
                ], 'LIKE', '%' . $search . '%');
            });
        })
            ->when($filters['bu'] ?? null, function ($query, $bu) {
                $companiesId = Company::where('name', $bu)->first('id');
                $query->where('company_id', $companiesId->id);
            });
    }

    public function cvHeader()
    {
        return $this->belongsTo(CvHeader::class);
    }

    public function borrowedCheck()
    {
        return $this->hasOne(BorrowedCheck::class, 'check_id')->where('check', 'cv');
    }
    public function checkStatus()
    {
        return $this->hasOne(CheckStatus::class, 'check_id')->where('check', 'cv');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function cancelledCheck()
    {
        return $this->hasOne(CancelledCheck::class);
    }
}
