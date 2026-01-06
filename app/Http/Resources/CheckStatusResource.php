<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CheckStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "status" => $this->status,
            "receivers_name" => $this->receivers_name,
            'image' => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'signature' => $this->signature
                ? asset('storage/' . $this->signature)
                : null,
            "cancelled_reason" => $this->cancelled_reason,
            "caused_by" => $this->caused_by,
            "checkable_type" => $this->checkable_type,
            "checkable_id" => $this->checkable_id,
            "created_at" => $this->created_at ? $this->created_at->toFormattedDateString() : 'N/A',
            "updated_at" => $this->updated_at,
        ];
    }
}
