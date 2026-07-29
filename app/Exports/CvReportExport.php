<?php

namespace App\Exports;


use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class CvReportExport implements FromCollection, WithHeadings, WithTitle, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected array $columns;
    protected array $data;
    public function __construct(array $data)
    {
        $this->data = $data;
        $this->columns = collect($data['columns'])->prepend('status')->all();
    }

    public function title(): string
    {
        return 'Cv/Crf Report';
    }

    public function headings(): array
    {
        return array_map(
            fn($value) => Str::headline($value),
            $this->columns
        );
    }

    public function collection()
    {
        $res = $this->getRecords()->map(function ($item) {
            $checkable = $item->checkable;
            return [
                'receiver_name' => $item->receiver_name,
                'status' => $item->status,
                'checkable_type' => $item->checkable_type,

                'no' => $item->checkable_type === 'cv' ? $checkable?->cv_no : $checkable?->crf,
                'cheque_number' => $checkable?->cheque_number,
                'cheque_amount' => $checkable?->cheque_amount,
                'cheque_date' => $checkable?->cheque_date,
                'payee' => $checkable?->payee,
                'approver_name' => $checkable?->borrowedCheque?->approver->name,
                'borrower_name' => $checkable?->borrowedCheque?->borrower_name,
                'borrower_no' => $checkable?->borrowedCheque?->borrower_no,
                'location' => $checkable?->tagLocation->location,
                'business_unit' => $checkable?->businessUnit->name,
            ];
        });
        return $res->map(fn($item) => Arr::only($item, $this->columns));
    }

    private function getRecords()
    {
        return ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit']])
            ->select('receiver_name', 'status', 'checkable_id', 'checkable_type')
            ->when(
                !empty($this->data['date']),
                fn($query) =>
                $query->whereDate('created_at', $this->data['date'])
            )
            ->when(
                !empty($this->data['status']),
                fn($query) =>
                $query->where(function ($q) {
                    $q->whereHas('chequeForwardedStatus', function ($q) {
                        $q->whereIn('status', $this->data['status']);
                    })
                        ->orWhere(function ($q) {
                            $q->whereDoesntHave('chequeForwardedStatus')
                                ->whereIn('status', $this->data['status']);
                        });
                })
            )
            ->when(
                !empty($this->data['bu']),
                fn($outerQuery) =>
                $outerQuery->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    function (Builder $query) {
                        $query->whereHas('businessUnit.company', function (Builder $query) {
                            $query->whereIn('name', $this->data['bu']);
                        });
                    }
                )
            )
            ->when(
                !empty($this->data['location']),
                fn($outerQuery) =>
                $outerQuery->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    function (Builder $query) {
                        $query->whereHas('tagLocation', function (Builder $query) {
                            $query->whereIn('location', $this->data['location']);
                        });
                    }
                )
            )
            ->get();
    }
}
