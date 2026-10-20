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
        $chequeDate = $this->cheque_date ? $this->cheque_date : null;
        $taggedAt = $this->tagged_at ? $this->tagged_at : null;
        $cvDate = optional($this)->document_date ? $this->document_date : null;
        // $staleThreshold = Date::today()->subMonths(6);

        // $status = null;
        // if ($chequeDate) {
        //     if ($chequeDate->lt($staleThreshold)) {
        //         $status = 'Stale Check';
        //     }
        // }

        return [
            'id' => $this->uid,
            'sourceId' => $this->source_id,
            'type' => $this->type,
            'cvNo' => $this->document_no,
            'cvDate' => optional($cvDate)->toFormattedDateString(),
            'chequeDate' => optional($chequeDate)->toFormattedDateString(),
            'chequeNumber' => optional($this)->cheque_number,
            'amount' => NumberHelper::currency(optional($this)->amount),
            'payee' => $this->payee,
            'taggedAt' => optional($taggedAt)->toFormattedDateString(),
            'location' => optional($this)->location,
            'companyName' => $this->company_name,
            'businessUnit' => $this->bu_name,
            'hasCrf' => (bool) $this->has_crf,
            'createdAt' => Date::parse($this->created_at)->toFormattedDateString()
            // 'cvNo' => $this->cv_no,
            // 'chequeId' => $this->cheque_id,
            // 'chequeNumber' => $this->cheque_number,
            // 'borrowedCheckId' => optional($this)->borrowedCheckId,
            // 'chequeDateUnformatted' => optional($chequeDate)->format('m-d-Y'),
            // 'chequeDate' => optional($chequeDate)->toFormattedDateString(),
            // 'companyName' => optional($this)->company_name,
            // 'buName' => optional($this)->bu_name,
            // 'bankName' => optional($this)->bank_name,
            // 'isReturned' => optional($this)->is_returned,
            // 'approvedAt' => optional($this)->approved_at,
            // 'statusOrder' => $this->status_order,
            // 'chequeDateStatus' => $status,
            // 'amount' => NumberHelper::currency($this->amount ?? 0),
            // 'amountUnformatted' => $this->amount,
            // 'payee' => $this->payee,
            // 'taggedAt' => $this->tagged_at,
            // 'type' => $this->type,
            // 'createdAt' => $this->created_at,
            // 'location' => $this->location,
            // 'cvDate' => optional($cvDate)->toFormattedDateString(),
            // 'taggedLocation' => StringHelper::statusLocation($this->location),

            // 'approversName' => optional($this)->approver_name,
            // 'scannedId' => optional($this)->scanned_id,
            // 'scannedPayee' => optional($this)->scanned_payee,
            // 'scannedAmount' => optional($this)->scanned_amount,
        ];
    }
}
