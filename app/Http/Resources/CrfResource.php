<?php

namespace App\Http\Resources;

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
            'crf' => $this->crf,
            'paidTo' => $this->paid_to,
            'amount' => $this->amount,
            'ckNo' => $this->ck_no
        ];
    }
}
