<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $guarded = [];
    public function bank(){
        return $this->belongsTo(Bank::class);
    }
}
