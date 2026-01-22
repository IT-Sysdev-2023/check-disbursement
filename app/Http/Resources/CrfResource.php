<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
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
            'cvNo' => $this->crf,
            'no' => $this->no,
            'company' => $this->getCompany,
            'checkDate' => $this->resolved_check_date ? $this->resolved_check_date->toFormattedDateString() : 'N/A',
            'location' => $this->location,
            'date' => $this->date ? $this->date->toFormattedDateString() : 'N/A',
            'payee' => $this->paid_to,
            'bank' => $this->bank,
            'particulars' => $this->particulars,
            'amount' => $this->formattedAmount,
            'unformattedAmount' => $this->amount,
            'checkNumber' => $this->ck_no,
            'preparedBy' => $this->prepared_by,
            'taggedAt' => $this->tagged_at,
            'borrowedCheck' => $this->whenLoaded('borrowedCheck'),
            'checkStatus' => new CheckStatusResource($this->whenLoaded('checkStatus')),

            'tagLocation' => $this->whenLoaded('tagLocation'),
            'scannedId' => $this->scanned_id,
            'taggedLocation' => $this->when($this->tag_location_id, StringHelper::statusLocation($this->tagLocation?->location)),
        ];
    }
}
