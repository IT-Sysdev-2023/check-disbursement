<?php

namespace App\Models;

use App\Models\Scopes\BusinessUnitAssignedScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

use Illuminate\Database\Eloquent\Casts\Attribute;

#[ScopedBy([BusinessUnitAssignedScope::class])]
class CvCheckPayment extends Model
{

    protected $guarded = [];


    protected function casts(): array
    {
        return [
            'check_date' => 'date',
            'clearing_date' => 'date',
        ];

    }

    protected function checkNumber(): Attribute
    {
        return new Attribute(
            get: fn($value, $attributes) => $attributes['check_number'] ?: $attributes['resolved_check_number'],
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
            $query->where(function ($q) use ($search) {
                $q->whereAny([
                    'cv_check_payments.check_amount',
                    'cv_check_payments.payee'
                ], 'LIKE', '%' . $search . '%')
                    ->orWhere(function ($q2) use ($search) {
                        $q2->where(function ($q3) use ($search) { // if check_number is not zero then filter
                            $q3->where('cv_check_payments.check_number', '!=', 0)
                                ->where('cv_check_payments.check_number', 'LIKE', "%{$search}%");
                        })
                            ->orWhere(function ($q3) use ($search) {
                                $q3->where('cv_check_payments.check_number', 0)
                                    ->where('cv_check_payments.resolved_check_number', 'LIKE', "%{$search}%");
                            });
                    })
                    ->orWhereHas('cvHeader', function (Builder $q2) use ($search) {
                        $q2->where('cv_no', 'LIKE', '%' . $search . '%');
                    });
            });
        })
            ->when(($filters['company'] ?? null) && $filters['company'] != 'all', function ($query) use ($filters) {
                $query->whereRelation('businessUnit.company', 'id', $filters['company']);
            })
            ->when(($filters['bu'] ?? null) && $filters['bu'] != 'all', function ($query) use ($filters) {
                $query->where('business_unit_id', $filters['bu']);
            })
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereRelation('cvHeader', function ($q) use ($date) {
                    $q->whereBetween('cv_date', [$date['start'], $date['end']]);
                });
            });
        // ->when($filters['sort'] ?? null, function (Builder $query, $sort) {

        //     $field = Str::snake($sort['field']);
        //     $direction = $sort['sort'];

        //     // Main table
        //     if (Schema::hasColumn('cv_check_payments', $field)) {
        //         return $query->orderBy($field, $direction);
        //     }

        //     // cvHeader relationship
        //     if (Schema::hasColumn('cv_headers', $field)) {
        //         return $query->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
        //             ->orderBy("cv_headers.$field", $direction)
        //             ->select('cv_check_payments.*');
        //     }

        //     // company relationship
        //     // if (Schema::hasColumn('companies', $field)) {
        //     //     return $query->join('companies', 'companies.id', '=', 'cv_check_payments.company_id')
        //     //         ->orderBy("companies.$field", $direction)
        //     //         ->select('cv_check_payments.*');
        //     // }

        // });
    }

    public function scopeBaseColumns(Builder $builder)
    {
        return $builder->select(
            'cv_check_payments.id as cheque_id',
            DB::raw('CASE WHEN check_number = 0 THEN resolved_check_number ELSE check_number END as check_number'),
            'cv_check_payments.check_date',
            'business_units.name as company_name',
            'check_amount as amount',
            'cv_check_payments.payee',
            'tagged_at',
            'tag_locations.location',
            DB::raw("'cv' as type"),
            'cv_check_payments.created_at',

            DB::raw("
                CASE
                    WHEN (CASE WHEN check_number = 0 THEN resolved_check_number ELSE check_number END) IS NULL THEN 'Assign Check Number'
                    WHEN cv_check_payments.check_date IS NULL THEN 'Assign Check Date'
                    WHEN tagged_at IS NOT NULL THEN 'For Signature'
                    ELSE 'Tagging'
                END as status_order
            ")
        )
            ->join('business_units', 'business_units.id', '=', 'cv_check_payments.business_unit_id')
            // ->join('companies', 'companies.id', '=', 'business_units.company_id')
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->leftJoin('tag_locations', 'tag_locations.id', '=', 'cv_check_payments.tag_location_id');
    }

    public function scopeScanRecords(Builder $builder)
    {
        return $builder
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.amount', '=', 'cv_check_payments.check_amount')
                    // ->whereNotNull('scanned_records.payee')
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
                                    'cv_check_payments.resolved_check_number'
                                );
                        });
                    });
            });
    }

    public function scopeLeftJoinScanRecords(Builder $builder)
    {
        return $builder
            ->join('borrowed_checks', 'borrowed_checks.checkable_id', '=', 'cv_check_payments.id')
            ->join('approvers', 'approvers.id', '=', 'borrowed_checks.approver_id')
            ->where('borrowed_checks.checkable_type', 'cv')
            ->whereNotNull('borrowed_checks.approver_id')
            ->leftJoin('scanned_records', function ($join) {
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
                                    'cv_check_payments.resolved_check_number'
                                );
                        });
                    });
            });
    }

    public function cvHeader()
    {
        return $this->belongsTo(CvHeader::class);
    }

    // public function assignedCheckNumber()
    // {
    //     return $this->hasOne(AssignedCheckNumber::class);
    // }

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
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
