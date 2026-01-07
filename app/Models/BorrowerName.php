<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BorrowerName extends Model
{
    public static function borrowerSelection()
    {
        return self::select('id', 'name')
            ->get()
            ->map(fn($name) => [
                'label' => $name->name,
                'value' => $name->id,
            ]);
    }
}
