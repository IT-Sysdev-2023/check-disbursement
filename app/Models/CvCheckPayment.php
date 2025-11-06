<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvCheckPayment extends Model
{
    public function cvHeader(){
        return $this->belongsTo(CvHeader::class);
    }
}
