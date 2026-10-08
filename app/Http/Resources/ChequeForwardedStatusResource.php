<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChequeForwardedStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'cancelled_reason' => $this->cancelled_reason,
            'caused_by' => $this->caused_by,
            'cheque_status_id' => $this->cheque_status_id,
            'forwarded_receivers_name' => $this->forwarded_receivers_name,
            'image' => $this->image,
            'signature' => $this->signature,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
