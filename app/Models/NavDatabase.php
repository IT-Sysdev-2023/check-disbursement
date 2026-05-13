<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavDatabase extends Model
{
    //
    public function navServer(){
        return $this->belongsTo(NavServer::class);
    }

    public function navChequePaymentTable(){
        return $this->hasOne(NavChequePaymentTable::class);
    }
    public function navHeaderTable(){
        return $this->hasOne(NavHeaderTable::class);
    }

    public function businessUnit(){
        return $this->belongsTo(BusinessUnit::class);
    }
}
