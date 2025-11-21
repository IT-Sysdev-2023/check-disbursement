<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvCheckPayment extends Model
{

    protected function casts(): array
    {
        return [
            'check_date' => 'datetime',
            'clearing_date' => 'datetime',
        ];

    }

    public function cvHeader()
    {
        return $this->belongsTo(CvHeader::class);
    }

    public function borrowedCheck()
    {
        return $this->hasOne(BorrowedCheck::class, 'check_id')->where('check', 'cv');
    }
    public function scannedCheck()
    {
        return $this->hasOne(ScannedCheck::class, 'check_id')->where('check', 'cv');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
