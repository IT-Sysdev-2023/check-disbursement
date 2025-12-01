<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

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
        // dd($filters['date'] );
        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereHas('cvHeader', function (Builder $query) use ($search) {
                $query->whereAny([
                    'cv_no',
                ], 'LIKE', '%' . $search . '%');
            });
        })
            ->when($filters['bu'] ?? null, function ($query, $bu) {
                $query->where('company_id', $bu);
            })
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereBetween('check_date', [$date['start'], $date['end']]);
            })
            ->when($filters['sort'] ?? null, function (Builder $query, $sort) {

                $field = Str::snake($sort['field']);
                $direction = $sort['sort'];

                // Main table
                if (Schema::hasColumn('cv_check_payments', $field)) {
                    return $query->orderBy($field, $direction);
                }

                // cvHeader relationship
                if (Schema::hasColumn('cv_headers', $field)) {
                    return $query->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
                        ->orderBy("cv_headers.$field", $direction)
                        ->select('cv_check_payments.*');
                }

                // company relationship
                if (Schema::hasColumn('companies', $field)) {
                    return $query->join('companies', 'companies.id', '=', 'cv_check_payments.company_id')
                        ->orderBy("companies.$field", $direction)
                        ->select('cv_check_payments.*');
                }

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
