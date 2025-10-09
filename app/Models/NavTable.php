<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavTable extends Model
{
    public function navDatabase(){
        return $this->hasOne(NavDatabase::class);
    }
}
