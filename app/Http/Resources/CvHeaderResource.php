<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CvHeaderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // id,cv_no,nav_header_table_id
        return [
            'id' => $this->id,
            'cvNo' => $this->cv_no,
            'cvDate' =>$this->cv_date ? $this->cv_date->toFormattedDateString() : 'N/A',
            'vendorNo' => $this->vendor_no ?: 'N/A',
            'remarks' => $this->remarks,
            'navHeaderTable' => new NavHeaderTableResource($this->whenLoaded('navHeaderTable'))
        ];
    }
}
