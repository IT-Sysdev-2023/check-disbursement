<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ChequeForwardedStatus extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }
    public function chequeStatus()
    {
        return $this->belongsTo(ChequeStatus::class);
    }
}
