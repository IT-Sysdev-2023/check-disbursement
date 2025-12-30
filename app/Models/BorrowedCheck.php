<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BorrowedCheck extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

    public function borrowerName()
    {
        return $this->belongsTo(BorrowerName::class);
    }

    public function approver()
    {
        return $this->belongsTo(Approver::class);
    }

    public function crf()
    {
        return $this->belongsTo(Crf::class, 'checkable_id');
    }

    public function cvCheckPayment()
    {
        return $this->belongsTo(CvCheckPayment::class, 'checkable_id');
    }

    public function checkRelation(string $type)
    {
        return match ($type) {
            'cv' => $this->cvCheckPayment(),
            'crf' => $this->crf(),
            default => null,
        };
    }

    public function checkable()
    {
        return $this->morphTo();
    }
}
