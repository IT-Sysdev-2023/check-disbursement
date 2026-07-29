<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScannedRecordResource extends JsonResource
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
            'bankAddress' => $this->bank_address,
            'bankAccountNumber' => $this->account_number,
            'micr' => $this->micr_number,
            'serialCode' => $this->serial_code,
            'bank' =>$this->bank_account_name,
            "amount" => NumberHelper::currency($this->amount),
            'chequeDate' => $this->cheque_date ? $this->cheque_date->toFormattedDateString() : 'N/A',
            'bu' => $this->bu,
            'chequeNo' => $this->cheque_no,
            'amountInWords' => $this->amount_in_words,
            'payee' => $this->payee,
            'postedDate' =>  $this->posted_date ? $this->posted_date->toFormattedDateString() : 'N/A',
            'seq' => $this->seq,
        ];
    }
}
