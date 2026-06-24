<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class NavDatabase extends Model
{
     protected static function booted(): void
    {
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('status', true);
        });
    }
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
