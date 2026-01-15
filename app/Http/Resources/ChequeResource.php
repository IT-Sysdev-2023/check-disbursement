<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class ChequeResource extends JsonResource
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
            'checkNumber' => $this->check_number,
            'checkDate' => $this->check_date ? Date::parse($this->check_date)->toFormattedDateString() : null,
            'companyName' => $this->company_name ?? null,
            'amount' => NumberHelper::currency($this->amount),
            'payee' => $this->payee,
            'taggedAt' => $this->tagged_at,
            'type' => $this->type,
            'createdAt' => $this->created_at,
        ];
    }
}
