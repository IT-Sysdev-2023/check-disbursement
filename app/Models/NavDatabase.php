<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavDatabase extends Model
{
    //
    public function navServer(){
        return $this->belongsTo(NavServer::class);
    }

    public function navCheckPaymentTable(){
        return $this->hasOne(NavCheckPaymentTable::class);
    }
    public function navHeaderTable(){
        return $this->hasOne(NavHeaderTable::class);
    }
    public function navLineTable(){
        return $this->hasOne(NavLineTable::class);
    }
}
