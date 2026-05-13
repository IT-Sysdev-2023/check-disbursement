<?php

namespace App\Models;

use App\Helpers\NumberHelper;
use App\Models\Scopes\BusinessUnitAssignedScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([BusinessUnitAssignedScope::class])]
class Crf extends Model
{
    protected $guarded = [];
    protected $table = 'crfs';

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'resolved_check_date' => 'date',
        ];

    }

    protected function checkDate(): Attribute
    {
        return new Attribute(
            get: fn() => $this->check_date ?? $this->resolved_check_date,
        );
    }

    protected function checkNumber(): Attribute
    {
        return new Attribute(
            get: fn() => $this->ck_no,
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
            get: fn() => $this->businessUnit?->name,
        );
    }

    protected function formattedAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => NumberHelper::currency($this->amount),
        );
    }

    public function scopeFilter(Builder $builder, $filters)
    {
        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'crfs.crf',
                'crfs.company_office',
                'crfs.no',
                'crfs.paid_to',
                'crfs.particulars',
                'crfs.amount',
                'crfs.ck_no'
            ], 'LIKE', '%' . $search . '%');
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
                $query->whereBetween('crfs.date', [$date['start'], $date['end']]);
            });
        // ->when($filters['sort'] ?? null, function (Builder $query, $sort) {
        //     $field = Str::snake($sort['field']);
        //     $direction = $sort['sort'];

        //     $table = $query->getModel()->getTable();

        //     if (Schema::hasColumn($table, $field)) {
        //         return $query->orderBy($field, $direction);
        //     }

        //     return $query;
        // });
        ;
    }

    public function scopeBaseColumns(Builder $builder)
    {
        return $builder->select(
            'crfs.id as cheque_id',
            'cheque_number',
            'resolved_cheque_date as check_date',
            'business_units.name as company_name',
            'crfs.amount',
            'paid_to as payee',
            'tagged_at',
            'tag_locations.location',
            DB::raw("'crf' as type"),
            'crfs.created_at',

            DB::raw("
                CASE
                    WHEN cheque_number is NULL THEN 'Assign Cheque Number'
                    WHEN crfs.resolved_cheque_date IS NULL THEN 'Assign Cheque Date'
                    WHEN tagged_at IS NOT NULL THEN 'For Signature'
                    ELSE 'Tagging'
                END as status_order
            ")
        )
            ->join('business_units', 'business_units.id', '=', 'crfs.business_unit_id')
            ->leftJoin('tag_locations', 'tag_locations.id', '=', 'crfs.tag_location_id');
    }
    public function scopeScanRecords(Builder $builder)
    {
        return $builder->join('scanned_records', function ($join) {
            $join->on('scanned_records.check_no', '=', 'crfs.ck_no')
                ->on('scanned_records.amount', '=', 'crfs.amount');
            // ->whereNotNull('scanned_records.payee');
        });
    }
    public function scopeLeftJoinScanRecords(Builder $builder)
    {
        return $builder->join('borrowed_cheques', 'borrowed_cheques.checkable_id', '=', 'crfs.id')
            // ->leftJoin('approvers as primary_approver', 'primary_approver.id', '=', 'borrowed_cheques.primary_approver_id')
            // ->leftJoin('approvers as secondary_approver', 'secondary_approver.id', '=', 'borrowed_cheques.secondary_approver_id')
            ->leftJoin('approvers', 'approvers.id', '=', 'borrowed_cheques.approver_id')
            ->where('borrowed_cheques.checkable_type', 'crf')
            ->whereNotNull('borrowed_cheques.approved_at')
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'crfs.cheque_number')
                    ->on('scanned_records.amount', '=', 'crfs.amount');
            });
    }

    public function tagLocation()
    {
        return $this->belongsTo(TagLocation::class);
    }

    public function borrowedCheck()
    {
        return $this->morphOne(BorrowedCheque::class, 'checkable');
    }
    public function chequeStatus()
    {
        return $this->morphOne(ChequeStatus::class, 'checkable');
    }

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
    }
}
