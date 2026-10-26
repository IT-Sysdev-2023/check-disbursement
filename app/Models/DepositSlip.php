<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DepositSlip extends Model
{
    protected $fillable = ['path', 'original_name', 'mime_type', 'size', 'uploaded_by'];

    public function borrowedCheques(): BelongsToMany
    {
        return $this->belongsToMany(
            BorrowedCheque::class,
            'borrowed_cheque_deposit_slips'
        );
    }
}
