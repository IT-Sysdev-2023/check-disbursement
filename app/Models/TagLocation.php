<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TagLocation extends Model
{
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

    public static function locationSelection()
    {
        return self::select('id', 'location')
            ->get()
            ->map(fn($name) => [
                'label' => $name->location,
                'value' => $name->id,
            ]);
    }
}
