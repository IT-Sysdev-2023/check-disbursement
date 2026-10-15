<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChequeRecord extends Model
{
    //THIS IS A READ-ONLY MODEL - You cant find it in database
    //To edit the columns - change the migration setup in cheque_records_table.php
    protected $table = 'cheque_records';

    protected $primaryKey = 'uid';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected static function booted(): void
    {
        static::saving(fn() => throw new \LogicException('ChequeRecord is read-only.'));
        static::deleting(fn() => throw new \LogicException('ChequeRecord is read-only.'));
    }

    public function source()
    {
        return $this->morphTo(
            'source',
            'type',
            'source_id'
        );
    }

    public function scopeCv($query)
    {
        return $query->where('type', 'cv');
    }
    public function scopeCrf($query)
    {
        return $query->where('type', 'crf');
    }
}
