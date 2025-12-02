<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CvHeader extends Model
{

      protected function casts(): array
    {
        return [
            'cv_date' => 'datetime',
        ];

    }
    public function cvCheckPayment(){
        return $this->hasOne(CvCheckPayment::class);
    }

    public function navHeaderTable(){
        return $this->belongsTo(NavHeaderTable::class);
    }
}
