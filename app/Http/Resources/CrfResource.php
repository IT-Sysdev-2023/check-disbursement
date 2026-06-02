<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class CrfResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $chequeDate = $this->resolved_cheque_date ? Date::parse($this->resolved_cheque_date) : null;
        $staleThreshold = Date::today()->subMonths(6);

        $status = null;
        if ($chequeDate) {
            if ($chequeDate->lt($staleThreshold)) {
                $status = 'staled';
            }
        }
        return [
            'id' => $this->id,
            'cvNo' => $this->crf,
            'no' => $this->no,
            'company' => $this->getCompany,
            'status' => $status,
            'chequeDate' => $chequeDate ? $chequeDate->toFormattedDateString() : 'N/A',
            'location' => $this->tagLocation?->location,
            'date' => $this->date ? $this->date->toFormattedDateString() : 'N/A',
            'payee' => $this->paid_to,
            'bank' => $this->bank,
            'particulars' => $this->particulars,
            'amount' => $this->formattedAmount,
            'unformattedAmount' => $this->amount,
            'checkNumber' => $this->cheque_number,
            'preparedBy' => $this->prepared_by,
            'taggedAt' => $this->tagged_at,
            'borrowedCheque' => $this->whenLoaded('borrowedCheque'),
            'chequeStatus' => new ChequeStatusResource($this->whenLoaded('chequeStatus')),

            'tagLocation' => new TagLocationResource($this->whenLoaded('tagLocation')),
            'scannedId' => $this->scanned_id,
            'taggedLocation' => $this->when($this->tag_location_id, StringHelper::statusLocation($this->tagLocation?->location)),
        ];
    }
}
