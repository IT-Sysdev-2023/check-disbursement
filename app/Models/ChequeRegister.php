<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChequeRegister extends Model
{
    protected $guarded = [];

    public function chequeRangeCancelled()
    {
        return $this->hasOne(ChequeRangeCancelled::class);
    }
    public function chequeRangeCancelleds()
    {
        return $this->hasMany(ChequeRangeCancelled::class);
    }
}
