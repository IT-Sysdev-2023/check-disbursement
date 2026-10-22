<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChequeRecordResource extends JsonResource
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
            'chequeId' => $this->cheque_id,
            'chequeNumber' => $this->cheque_number,
            'chequeDate' => $this->cheque_date->toFormattedDateString(),
            'payee' => $this->payee ?? '',
            'approverName' => $this->approver_name,
            'scannedId' => $this->scannedId ?? null,
            'type' =>$this->type,
            'location' => $this->location,
            'businessUnit' => $this->business_unit,
        ];
    }
}
