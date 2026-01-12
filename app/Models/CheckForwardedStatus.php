<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckForwardedStatus extends Model
{
    protected $guarded = [];

    public function checkStatus(){
        return $this->belongsTo(CheckStatus::class);
    }
}
