<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvHeader extends Model
{
    public function cvCheckPayment(){
        return $this->hasOne(CvCheckPayment::class);
    }

    public function navHeaderTable(){
        return $this->belongsTo(NavHeaderTable::class);
    }
}
