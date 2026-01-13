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
            'id' => $this->id,
            'borrowerNoClean' => $this->borrower_no,
            'borrowerNo' => NumberHelper::padLeft($this->borrower_no),
            'borrower' => $this->borrower,
            'reason' => $this->reason,
            'check' => $this->checkable_type,
            'totalChecks' => $this->total_checks,
            'checkable' => $this->whenLoaded('checkable', fn() => $this->resolveCheckable()),
            'approver' => $this->whenLoaded('approver'),
            'lastBorrowedAt' => Date::parse($this->last_borrowed_at)->format('M d, Y H:i A'),
        ];
    }

    protected function resolveCheckable()
    {
        return match ($this->checkable_type) {
            'cv' => new CvCheckPaymentResource($this->checkable),
            'crf' => new CrfResource($this->checkable),
            default => null,
        };
    }
}
