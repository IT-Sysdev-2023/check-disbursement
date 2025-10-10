<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavServer extends Model
{
    public function navDatabases(){
        return $this->hasMany(NavDatabase::class);
    }
}
