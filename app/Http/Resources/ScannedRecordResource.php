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
            'accountNo' => $this->account_no,
            'bank' =>$this->bank,
            "amount" => NumberHelper::currency($this->amount),
            'checkDate' => $this->check_date ? $this->check_date->toFormattedDateString() : 'N/A',
            'branchCode' => $this->branch_code,
            "branchName" => $this->branch_name,
            'bu' => $this->bu,
            'checkNo' => $this->check_no,
            'payee' => $this->payee,
            'postedDate' =>  $this->posted_date ? $this->posted_date->toFormattedDateString() : 'N/A',
            'seq' => $this->seq,

            'bankAccount' => $this->whenLoaded('bankAccount')
        ];
    }
}
