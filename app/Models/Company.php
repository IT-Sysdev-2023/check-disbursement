<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    public function businessUnits()
    {
        return $this->hasMany(BusinessUnit::class);
    }
}
