<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavHeaderTable extends Model
{
    public function navDatabase(){
        return $this->belongsTo(NavDatabase::class);
    }
}
