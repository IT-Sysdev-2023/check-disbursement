<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChequeForwardedStatus extends Model
{
    protected $guarded = [];

    public function chequeStatus(){
        return $this->belongsTo(ChequeStatus::class);
    }
}
