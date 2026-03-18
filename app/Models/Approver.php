<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Approver extends Model
{

    public static function approverSelection()
    {
        return self::select('id as value', 'name as label')->get();
    }
    public function primaryBorrowedCheck()
    {
        return $this->hasOne(BorrowedCheck::class, 'primary_approver_id');
    }
}
