<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Date;

class Cv extends Model
{
    protected function casts(): array
    {
        return [
            'check_date' => 'datetime'
        ];
    }
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->toFormattedDateString();
    }
}
