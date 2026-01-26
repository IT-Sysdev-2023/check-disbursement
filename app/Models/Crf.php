<?php

namespace App\Models;

use App\Helpers\NumberHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Crf extends Model
{
    protected $guarded = [];
    protected $table = 'crfs';

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'resolved_check_date' => 'datetime',
        ];

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
            get: fn() => $this->company?->name,
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
                'crf',
                'company',
                'no',
                'paid_to',
                'particulars',
                'amount',
                'ck_no'
            ], 'LIKE', '%' . $search . '%');
        })
            ->when($filters['sort'] ?? null, function (Builder $query, $sort) {
                $field = Str::snake($sort['field']);
                $direction = $sort['sort'];

                $table = $query->getModel()->getTable();

                if (Schema::hasColumn($table, $field)) {
                    return $query->orderBy($field, $direction);
                }

                return $query;
            });
        ;
    }

    public function scopeBaseColumns(Builder $builder)
    {
        return $builder->select(
            'crfs.id as cheque_id',
            'ck_no as check_number',
            'resolved_check_date as check_date',
            'companies.name as company_name',
            'crfs.amount',
            'paid_to as payee',
            'tagged_at',
            'tag_locations.location',
            DB::raw("'crf' as type"),
            'crfs.created_at'
        )
            ->join('companies', 'companies.id', '=', 'crfs.company_id')
            ->join('tag_locations', 'tag_locations.id', '=', 'crfs.tag_location_id');
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
        return $builder->join('borrowed_checks', 'borrowed_checks.checkable_id', '=', 'crfs.id')
            ->join('approvers', 'approvers.id', '=', 'borrowed_checks.approver_id')
            
            ->where('borrowed_checks.checkable_type', 'crf')
            ->whereNotNull('borrowed_checks.approver_id')
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'crfs.ck_no')
                    ->on('scanned_records.amount', '=', 'crfs.amount');
            });
    }

    public function tagLocation()
    {
        return $this->belongsTo(TagLocation::class);
    }

    public function borrowedCheck()
    {
        return $this->morphOne(BorrowedCheck::class, 'checkable');
    }
    public function checkStatus()
    {
        return $this->morphOne(CheckStatus::class, 'checkable');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
