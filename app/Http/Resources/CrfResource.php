<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CrfResource extends JsonResource
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
            'crf' => $this->crf,
            'no' => $this->no,
            'company' => $this->company,
            'location' => $this->location,
            'date' => $this->date ? $this->date->toFormattedDateString() : 'N/A',
            'paidTo' => $this->paid_to,
            'bank' => $this->bank,
            'particulars' => $this->particulars,
            'amount' => NumberHelper::currency($this->amount),
            'ckNo' => $this->ck_no,
            'preparedBy' => $this->prepared_by,
            'borrowedCheck' => $this->whenLoaded('borrowedCheck'),
            'checkStatus' => $this->whenLoaded('checkStatus'),
        ];
    }
}
