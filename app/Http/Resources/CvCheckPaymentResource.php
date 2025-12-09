<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
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

            'checkAmount' => NumberHelper::currency($this->check_amount),

            'payee' => $this->payee,
            'bankName' => $this->bank_name,
            'bankAccountNo' => $this->bank_account_no,
            'checkClassLocation' => $this->check_class_location ?: 'N/A',
            'clearingDate' => $this->clearing_date ? $this->clearing_date->toFormattedDateString() : 'N/A',

            'company' => $this->whenLoaded('company'),
            'cvHeader' => new CvHeaderResource($this->whenLoaded('cvHeader')),
            'borrowedCheck' => $this->whenLoaded('borrowedCheck'),
            'checkStatus' => $this->whenLoaded('checkStatus'),
            'assignedCheckNumbers' => $this->whenLoaded('assignedCheckNumber'),
        ];
    }
}
