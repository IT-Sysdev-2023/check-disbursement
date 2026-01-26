<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScannedRecords extends Model
{
    protected $guarded = [];
    protected function casts(): array
    {
        return [
            'posted_date' => 'datetime',
            'date' => 'datetime'
        ];

    }
}
