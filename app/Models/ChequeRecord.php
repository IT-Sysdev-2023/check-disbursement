<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


class ChequeRecord extends Model
{
    //THIS IS A READ-ONLY MODEL - You cant find it in database
    //To edit the columns - change the migration setup in cheque_records_table.php
    protected $table = 'cheque_records';

    protected $primaryKey = 'uid';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(fn() => throw new \LogicException('ChequeRecord is read-only.'));
        static::deleting(fn() => throw new \LogicException('ChequeRecord is read-only.'));
    }

    protected function casts(): array
    {
        return [
            'document_date' => 'date',
            'cheque_date' => 'date',
            'tagged_at' => 'datetime',
            'created_at' => 'datetime',
        ];

    }

    public function source()
    {
        return $this->morphTo(
            'source',
            'type',
            'source_id'
        );
    }
    public function scopeFilter(Builder $builder, array $filters)
    {
        $type = $filters['documentType'] ?? null;

        return $builder->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereAny([
                'document_no',
                'cheque_number',
                'payee',
                'amount',
                'location',
                'company_name',
                'bu_name',
            ], 'LIKE', '%' . $search . '%');
        })
            ->when($type && ($type !== 'all'), function ($query) use ($type) {
                $query->when($type === 'combine', fn($q) => $q->where('has_crf', 1), fn($q) => $q->where('type', $type));
            })
            ->when(($filters['company'] ?? null) && $filters['company'] != 'all', function ($query) use ($filters) {
                $query->whereRelation('source.businessUnit.company', 'id', $filters['company']);
            })
            ->when(($filters['bu'] ?? null) && $filters['bu'] != 'all', function ($query) use ($filters) {
                if (is_numeric($filters['bu'])) {
                    $query->whereRelation('source.businessUnit', 'id', $filters['bu']);
                } else {
                    $query->where('bu_name', $filters['bu']);
                }
            })
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereBetween('document_date', [$date['start'], $date['end']]);
            });
    }

    public function scopeCv($query)
    {
        return $query->where('type', 'cv');
    }
    public function scopeCrf($query)
    {
        return $query->where('type', 'crf');
    }
}
