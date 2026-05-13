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
        $checkDate = $this->cheque_date ? Date::parse($this->cheque_date) : null;
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
            'checkNumber' => $this->cheque_number,
            'isScanned' => $this->isScanned ?? null,
            'borrowedCheckId' => optional($this)->borrowedCheckId,
            'checkDateUnformatted' => optional($checkDate)->format('m-d-Y'),
            'checkDate' => optional($checkDate)->toFormattedDateString(),
            'companyName' => optional($this)->company_name,
            'isReturned' => optional($this)->is_returned,
            'approvedAt' => optional($this)->approved_at,
            'secondaryBorrower' => optional($this)->secondary_borrower,
            'statusOrder' => $this->status_order,
            'checkDateStatus' => $status,
            'amount' => NumberHelper::currency($this->amount),
            'amountUnformatted' => $this->amount,
            'payee' => $this->payee,
            'taggedAt' => $this->tagged_at,
            'type' => $this->type,
            'createdAt' => $this->created_at,
            'location' => $this->location,
            'taggedLocation' => StringHelper::statusLocation($this->location),

            'approversName' => optional($this)->approver_name,
            'scannedId' => optional($this)->scanned_id,
            'scannedPayee' => optional($this)->scanned_payee,
            'scannedAmount' => optional($this)->scanned_amount,
        ];
    }
}
