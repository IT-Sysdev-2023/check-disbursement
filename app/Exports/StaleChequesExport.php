<?php

namespace App\Exports;


use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class StaleChequesExport implements FromCollection, WithHeadings, WithTitle, ShouldAutoSize
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
        return 'Stale Cheques';
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
            $status = $item->chequeForwardedStatus?->status ?? $item->status;
            return [
                'receiver_name' => $item->receiver_name,
                'status' => $status,
                'checkable_type' => $item->checkable_type,

                'no' => $item->checkable_type === 'cv' ? $checkable?->cv_no : $checkable?->crf_no,
                'cheque_number' => $checkable?->cheque_number,
                'cheque_amount' => $checkable?->cheque_amount,
                'cheque_date' => $checkable?->cheque_date ? Date::parse($checkable->cheque_Date)->format('Y-m-d') : null,
                'payee' => $checkable?->payee,
                'approver_name' => $checkable?->borrowedCheque?->approver->name,
                'borrower_name' => $checkable?->borrowedCheque?->borrower_name,
                'borrower_no' => $checkable?->borrowedCheque?->borrower_no,
                'location' => $checkable?->tagLocation->location,
                'business_unit' => $checkable?->businessUnit->name,
            ];
        });

        return $res->map(
            fn($item) => collect($this->columns)
                ->map(fn($column) => $item[$column] ?? null)
                ->all()
        );
    }

    private function getRecords()
    {
        return ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit'], 'chequeForwardedStatus'])
            ->select('receiver_name', 'status', 'checkable_id', 'checkable_type', 'id')
            ->when(
                !empty($this->data['startDate']),
                fn($query) => $query->whereDate(
                    'created_at',
                    '>=',
                    $this->data['startDate']
                )
            )
            ->when(
                !empty($this->data['endDate']),
                fn($query) => $query->whereDate(
                    'created_at',
                    '<=',
                    $this->data['endDate']
                )
            )
            ->whereHasMorph('checkable', [Cv::class, Crf::class], function ($q, $type) {
                $q->where('cheque_date', '<', now()->subMonths(6));
            })
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
            ->get();
    }
}
