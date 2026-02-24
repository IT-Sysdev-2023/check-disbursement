<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrower extends Model
{
    public static function borrowerSelection()
    {
        return self::select('id as value', 'name as label')
            ->get();
    }
}
