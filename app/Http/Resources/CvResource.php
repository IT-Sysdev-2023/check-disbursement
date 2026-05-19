<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class CvResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $chequeDate = $this->cheque_date ? Date::parse($this->cheque_date) : null;
        $staleThreshold = Date::today()->subMonths(6);

        $status = null;
        if ($chequeDate) {
            if ($chequeDate->lt($staleThreshold)) {
                $status = 'staled';
            }
        }

        return [

            'id' => $this->id,

            'cvHeaderId' => $this->cv_header_id,

            'chequeNumber' => $this->cheque_number,
            'chequeDate' => $chequeDate ? $chequeDate->toFormattedDateString() : 'N/A',

            'amount' => $this->cheque_amount ? NumberHelper::currency($this->cheque_amount) : 0,
            'unformattedAmount' => $this->cheque_amount,

            'status' => $status,
            'taggedAt' => $this->tagged_at,
            'payee' => $this->payee,
            'bank' => $this->bank_name,
            'bankAccountNo' => $this->bank_account_no,
            'remarks' => $this->remarks,

            'scannedId' => $this->scanned_id,
            'location' => $this->tagLocation?->location,
            'taggedLocation' => $this->when($this->tag_location_id, StringHelper::statusLocation($this->tagLocation?->location)),
            'cvNo' => $this->cv_no,
            'company' => $this->businessUnit->name,

            'cvHeader' => new CvHeaderResource($this->whenLoaded('cvHeader')),
            'borrowedCheque' => $this->whenLoaded('borrowedCheque'),
            'chequeStatus' => new ChequeStatusResource($this->whenLoaded('chequeStatus')),
            'assignedCheckNumbers' => $this->whenLoaded('assignedCheckNumber'),
            'tagLocation' => new TagLocationResource($this->whenLoaded('tagLocation')),
            'businessUnit' => $this->whenLoaded('businessUnit')
        ];
    }
}
