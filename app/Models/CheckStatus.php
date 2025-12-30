<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckStatus extends Model
{
     protected $guarded = [];

     protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

     public function checkable()
     {
          return $this->morphTo();
     }
}
