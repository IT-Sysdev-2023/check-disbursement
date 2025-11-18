<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvCheckPayment extends Model
{
    public function cvHeader(){
        return $this->belongsTo(CvHeader::class);
    }

    public function borrowedCheck(){
        return $this->hasOne(BorrowedCheck::class, 'check_id');
    }
}
