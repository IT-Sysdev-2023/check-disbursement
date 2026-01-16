<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class CvCheckPaymentResource extends JsonResource
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

            'cvHeaderId' => $this->cv_header_id,

            'checkNumber' => $this->check_number,
            'checkDate' => $this->check_date ? $this->check_date->toFormattedDateString() : 'N/A',

            'amount' => $this->check_amount ? NumberHelper::currency($this->check_amount) : 0,
            'taggedAt' => $this->tagged_at,
            'payee' => $this->payee,
            'bank' => $this->bank_name,
            'bankAccountNo' => $this->bank_account_no,
            'checkClassLocation' => $this->check_class_location ?: 'N/A',
            'clearingDate' => $this->clearing_date ? $this->clearing_date->toFormattedDateString() : 'N/A',

            'scannedId' => $this->scanned_id,
            'taggedLocation' => $this->when($this->tag_location_id, StringHelper::statusLocation($this->tagLocation?->location)),
            'cvNo' => $this->cvHeader?->cv_no,
            'company' => $this->company->name,

            'cvHeader' => new CvHeaderResource($this->whenLoaded('cvHeader')),
            'borrowedCheck' => $this->whenLoaded('borrowedCheck'),
            'checkStatus' => new CheckStatusResource($this->whenLoaded('checkStatus')),
            'assignedCheckNumbers' => $this->whenLoaded('assignedCheckNumber'),
            'tagLocation' => $this->whenLoaded('tagLocation'),
        ];
    }
}
