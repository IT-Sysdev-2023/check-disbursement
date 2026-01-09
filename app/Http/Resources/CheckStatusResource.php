<?php

namespace App\Http\Resources;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

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
            "status" => Str::title($this->status),
            "receiversName" => $this->receivers_name,
            'image' => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'signature' => $this->signature
                ? asset('storage/' . $this->signature)
                : null,
            "cancelledReason" => $this->cancelled_reason,
            "causedBy" => $this->caused_by,
            "checkableType" => Str::upper($this->checkable_type),
            "checkableId" => $this->checkable_id,
            'checkable' => $this->whenLoaded('checkable', fn() => $this->resolveCheckable()),
            "createdAt" => $this->created_at ? $this->created_at->toFormattedDateString() : 'N/A',
            "updatedAt" => $this->updated_at,
        ];
    }

    protected function resolveCheckable()
    {
        return match ($this->checkable_type) {
            'cv' => new CvCheckPaymentResource($this->checkable),
            'crf' => new CrfResource($this->checkable),
            default => null,
        };
    }
}
