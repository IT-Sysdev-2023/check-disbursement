<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Casts\Attribute;

class CvCheckPayment extends Model
{

    protected function casts(): array
    {
        return [
            'check_date' => 'datetime',
            'clearing_date' => 'datetime',
        ];

    }

    protected function checkNumber(): Attribute
    {
        return new Attribute(
            get: fn() => $this->check_number ?? $this->assignedCheckNumber?->check_number,
        );
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
            get: fn() => $this->company?->company,
        );
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

    public function scopeScanRecords(Builder $builder)
    {
        return $builder
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.amount', '=', 'cv_check_payments.check_amount')
                    ->where(function ($q) {
                        $q->where(function ($q) {
                            $q->where('cv_check_payments.check_number', '!=', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'cv_check_payments.check_number'
                                );
                        })->orWhere(function ($q) {
                            $q->where('cv_check_payments.check_number', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'assigned_check_numbers.check_number'
                                );
                        });
                    });
            });
    }

    public function scopeLeftJoinScanRecords(Builder $builder)
    {
        return $builder
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'assigned_check_numbers.check_number')
                    ->on('scanned_records.amount', '=', 'cv_check_payments.check_amount');
            });
    }
    public function cvHeader()
    {
        return $this->belongsTo(CvHeader::class);
    }

    public function assignedCheckNumber()
    {
        return $this->hasOne(AssignedCheckNumber::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }


    public function tagLocation()
    {
        return $this->belongsTo(TagLocation::class);
    }

    public function checkStatus()
    {
        return $this->morphOne(CheckStatus::class, 'checkable');
    }
    public function borrowedCheck()
    {
        return $this->morphOne(BorrowedCheck::class, 'checkable');
    }
}
