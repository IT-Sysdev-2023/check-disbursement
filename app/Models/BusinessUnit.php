<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessUnit extends Model
{
    protected $guarded = [];

    public function company(){
        return $this->belongsTo(Company::class);
    }

    public function navDatabases(){
        return $this->hasOne(NavDatabase::class);
    }
}
