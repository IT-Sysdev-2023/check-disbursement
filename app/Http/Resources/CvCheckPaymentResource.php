<?php

namespace App\Http\Resources;

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

            'checkDate' => $this->check_date->toFormattedDateString(),

            'checkAmount' => $this->check_amount,
            
            'payee' => $this->payee,

            'company' => $this->whenLoaded('company'),
            'cvHeader' => new CvHeaderResource($this->whenLoaded('cvHeader')),
            'borrowedCheck' => $this->whenLoaded('borrowedCheck'),
            'scannedCheck' => $this->whenLoaded('scannedCheck'),

        ];
    }
}
