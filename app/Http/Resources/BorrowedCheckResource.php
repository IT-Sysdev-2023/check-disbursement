<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;

class BorrowedCheckResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'borrowerNoClean' => $this->borrower_no,
            'borrowerNo' => NumberHelper::padLeft($this->borrower_no),
            'borrowerName' => $this->borrower_name,
            'reason' => $this->reason,
            'check' => $this->check,
            'totalChecks' => $this->total_checks,
            'lastBorrowedAt' => Date::parse($this->last_borrowed_at)->format('M d, Y H:i A'),
        ];
    }
}
