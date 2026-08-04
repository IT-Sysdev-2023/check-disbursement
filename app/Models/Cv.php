<?php

namespace App\Models;

use App\Models\Scopes\BusinessUnitAssignedScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    protected function chequeNumber(): Attribute
    {
        return new Attribute(
            get: fn($value, $attributes) => $attributes['cheque_number'] ?: $attributes['resolved_cheque_number'],
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

    // public function scopeScan(Builder $builder, array $filters){
    //     return $builder->where($this->chequeNumber, );
    // }

    public function scopeFilter(Builder $builder, array $filters)
    {
        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->whereAny([
                    'cvs.cheque_amount',
                    'cvs.payee'
                ], 'LIKE', '%' . $search . '%')
                    ->orWhere(function ($q2) use ($search) {
                        $q2->where(function ($q3) use ($search) { // if check_number is not zero then filter
                            $q3->where('cvs.cheque_number', '!=', 0)
                                ->where('cvs.cheque_number', 'LIKE', "%{$search}%");
                        })
                            ->orWhere(function ($q3) use ($search) {
                                $q3->where('cvs.cheque_number', 0)
                                    ->where('cvs.resolved_cheque_number', 'LIKE', "%{$search}%");
                            });
                    });
            });
        })
            ->when(($filters['company'] ?? null) && $filters['company'] != 'all', function ($query) use ($filters) {
                $query->whereRelation('businessUnit.company', 'id', $filters['company']);
            })
            ->when(($filters['bu'] ?? null) && $filters['bu'] != 'all', function ($query) use ($filters) {
                if (is_numeric($filters['bu'])) {
                    $query->where('business_unit_id', $filters['bu']);
                } else {
                    $query->whereRelation('businessUnit', 'name', $filters['bu']);
                }
            })
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereBetween('cv_date', [$date['start'], $date['end']]);
            })
            ->when(($filters['bank'] ?? null) && $filters['bank'] != 'All', function ($query) use ($filters) {
                $query->where('bank_name', $filters['bank']);
            })
            ->when(($filters['bankAccount'] ?? null) && $filters['bankAccount'] != 'All', function ($query) use ($filters) {
                $query->where('bank_account_no', $filters['bankAccount']);
            });
    }

    public function scopeBaseColumns(Builder $builder)
    {
        return $builder->select(
            'cvs.id as cheque_id',
            DB::raw('CASE WHEN cheque_number = 0 THEN resolved_cheque_number ELSE cheque_number END as cheque_number'),
            'cvs.cheque_date',
            'companies.name as company_name',
            'business_units.name as bu_name',
            'cheque_amount as amount',
            'cvs.payee',
            'tagged_at',
            'tag_locations.location',
            DB::raw("'cv' as type"),
            'bank_name',
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
            ->join('companies', 'companies.id', '=', 'business_units.company_id')
            ->leftJoin('tag_locations', 'tag_locations.id', '=', 'cvs.tag_location_id');
    }

    public function scopeScanRecords(Builder $builder)
    {
        return $builder
            ->join('borrowed_cheques', 'borrowed_cheques.checkable_id', '=', 'cvs.id')
            ->join('scanned_records', 'scanned_records.borrowed_cheque_id', '=', 'borrowed_cheques.id');
        // ->join('scanned_records', function ($join) {
        //     $join->on('scanned_records.amount', '=', 'cvs.cheque_amount')
        //         // ->whereNotNull('scanned_records.payee')
        //         ->where(function ($q) {
        //             $q->where(function ($q) {
        //                 $q->where('cvs.cheque_number', '!=', 0)
        //                     ->whereColumn(
        //                         'scanned_records.cheque_no',
        //                         'cvs.cheque_number'
        //                     );
        //             })->orWhere(function ($q) {
        //                 $q->where('cvs.cheque_number', 0)
        //                     ->whereColumn(
        //                         'scanned_records.cheque_no',
        //                         'cvs.resolved_cheque_number'
        //                     );
        //             });
        //         });
        // });
    }

    public function scopeLeftJoinScanRecords(Builder $builder)
    {
        return $builder
            ->join('borrowed_cheques', 'borrowed_cheques.checkable_id', '=', 'cvs.id')
            // ->leftJoin('approvers as primary_approver', 'primary_approver.id', '=', 'borrowed_cheques.primary_approver_id')
            // ->leftJoin('approvers as secondary_approver', 'secondary_approver.id', '=', 'borrowed_cheques.secondary_approver_id')
            ->leftJoin('approvers', 'approvers.id', '=', 'borrowed_cheques.approver_id')
            ->where('borrowed_cheques.checkable_type', 'cv')
            ->whereNotNull('borrowed_cheques.approved_at')
            ->leftJoin('scanned_records', 'scanned_records.borrowed_cheque_id', '=', 'borrowed_cheques.id');
        // ->leftJoin('scanned_records', function ($join) {
        //     $join->on('scanned_records.amount', '=', 'cvs.cheque_amount')
        //         ->where(function ($q) {
        //             $q->where(function ($q) {
        //                 $q->where('cvs.cheque_number', '!=', 0)
        //                     ->whereColumn(
        //                         'scanned_records.cheque_no',
        //                         'cvs.cheque_number'
        //                     );
        //             })->orWhere(function ($q) {
        //                 $q->where('cvs.cheque_number', 0)
        //                     ->whereColumn(
        //                         'scanned_records.cheque_no',
        //                         'cvs.resolved_cheque_number'
        //                     );
        //             });
        //         });
        // });
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

    public function navHeaderTable()
    {
        return $this->belongsTo(NavHeaderTable::class);
    }


    public function tagLocation()
    {
        return $this->belongsTo(TagLocation::class);
    }

    public function chequeStatus()
    {
        return $this->morphOne(ChequeStatus::class, 'checkable');
    }
    public function borrowedCheque()
    {
        return $this->morphOne(BorrowedCheque::class, 'checkable');
    }
}
