<?php

namespace App\Http\Resources;

use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
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
        $checkDate = $this->check_date ? Date::parse($this->check_date) : null;
        $staleThreshold = Date::today()->subMonths(6);

        $status = null;
        if ($checkDate) {
            if ($checkDate->lt($staleThreshold)) {
                $status = 'Stale Check';
            }
        }

        return [
            'id' => $this->cheque_id,
            'chequeId' => $this->cheque_id,
            'checkNumber' => $this->check_number,
            'borrowedCheckId' => $this->borrowedCheckId ?? null,
            'checkDate' => $checkDate ? $checkDate->toFormattedDateString() : null,
            'companyName' => $this->company_name ?? null,
            'checkDateStatus' => $status,
            'amount' => NumberHelper::currency($this->amount),
            'amountUnformatted' => $this->amount,
            'payee' => $this->payee,
            'taggedAt' => $this->tagged_at,
            'type' => $this->type,
            'createdAt' => $this->created_at,
            'location' => $this->location,
            'taggedLocation' => StringHelper::statusLocation($this->location),

            'approversName' => $this->approver_name ?? null,
            'scannedId' => $this->scanned_id ?? null,
            'scannedPayee' => $this->scanned_payee ?? null,
            'scannedAmount' => $this->scanned_amount ?? null,
        ];
    }
}
