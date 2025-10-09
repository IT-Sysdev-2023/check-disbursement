<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavDatabase extends Model
{
    //
    public function navServer(){
        return $this->belongsTo(NavServer::class);
    }

    public function navTable(){
        return $this->belongsTo(NavTable::class);
    }
}
