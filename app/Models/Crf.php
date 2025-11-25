<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crf extends Model
{
    protected $guarded = [];
    protected $table = 'crfs';

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
        ];

    }


    public function borrowedCheck()
    {
        return $this->hasOne(BorrowedCheck::class, 'check_id')->where('check', 'crf');
    }
    public function scannedCheck()
    {
        return $this->hasOne(ScannedCheck::class, 'check_id')->where('check', 'crf');
    }
     public function releasedCheck(){
        return $this->hasOne(ReleasedCheck::class, 'check_id');
    }
}
