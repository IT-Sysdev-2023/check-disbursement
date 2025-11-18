<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crf extends Model
{
    protected $guarded = [];
    protected $table = 'crfs';

    public function borrowedCheck(){
        return $this->hasOne(BorrowedCheck::class, 'check_id')->where('check', 'crf');
    }
}
