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
class Cv extends Model
{

    protected $guarded = [];


    protected function casts(): array
    {
        return [
            'cheque_date' => 'date',
            'cv_date' => 'date',
            'resolved_cheque_date' => 'date',
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
                if (is_numeric($filters['bu'])) {
                    $query->where('business_unit_id', $filters['bu']);
                }else{
                    $query->whereRelation('businessUnit', 'name', $filters['bu']);
                }
            })
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereRelation('cvHeader', function ($q) use ($date) {
                    $q->whereBetween('cv_date', [$date['start'], $date['end']]);
                });
            });
    }

    public function scopeBaseColumns(Builder $builder)
    {
        return $builder->select(
            'cvs.id as cheque_id',
            DB::raw('CASE WHEN cheque_number = 0 THEN resolved_cheque_number ELSE cheque_number END as cheque_number'),
            'cheque_date',
            'business_units.name as company_name',
            'cheque_amount as amount',
            'cvs.payee',
            'tagged_at',
            'tag_locations.location',
            DB::raw("'cv' as type"),
            'cvs.created_at',

            DB::raw("
                CASE
                    WHEN (CASE WHEN cheque_number = 0 THEN resolved_cheque_number ELSE cheque_number END) IS NULL THEN 'Assign Cheque Number'
                    WHEN cvs.cheque_date IS NULL THEN 'Assign Cheque Date'
                    WHEN tagged_at IS NOT NULL THEN 'For Signature'
                    ELSE 'Tagging'
                END as status_order
            ")
        )
            ->join('business_units', 'business_units.id', '=', 'cvs.business_unit_id')
            ->leftJoin('tag_locations', 'tag_locations.id', '=', 'cvs.tag_location_id');
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
            ->join('borrowed_checks', 'borrowed_checks.checkable_id', '=', 'cvs.id')
            // ->leftJoin('approvers as primary_approver', 'primary_approver.id', '=', 'borrowed_checks.primary_approver_id')
            // ->leftJoin('approvers as secondary_approver', 'secondary_approver.id', '=', 'borrowed_checks.secondary_approver_id')
            ->leftJoin('approvers', 'approvers.id', '=', 'borrowed_checks.approver_id')
            ->where('borrowed_checks.checkable_type', 'cv')
            ->whereNotNull('borrowed_checks.approved_at')
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.amount', '=', 'cvs.cheque_amount')
                    ->where(function ($q) {
                        $q->where(function ($q) {
                            $q->where('cvs.cheque_number', '!=', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'cvs.cheque_number'
                                );
                        })->orWhere(function ($q) {
                            $q->where('cvs.cheque_number', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'cvs.resolved_cheque_number'
                                );
                        });
                    });
            });
    }

    // public function cvHeader()
    // {
    //     return $this->belongsTo(CvHeader::class);
    // }

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
