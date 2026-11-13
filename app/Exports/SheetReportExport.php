<?php

namespace App\Exports;


use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

class SheetReportExport implements FromCollection, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected Collection $data;
    protected string $title;
    public function __construct(Collection $data, string $title)
    {
        $this->data = $data;
        $this->title = $title;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function headings(): array
    {
        return array_map(
            fn($value) => Str::headline($value),
            $this->data->get('columns')
        );
    }

    public function collection()
    {
        $res = $this->getRecords()->map(function ($item) {
            $checkable = $item->checkable;
            return [
                'receiver_name' => $item->receiver_name,
                'status' => $item->status,
                "date_of_action" => $item->created_at ? Date::parse($item->created_at)->format('Y-m-d') : 'N/A',
                'checkable_type' => $item->checkable_type,

                'no' => $item->checkable_type === 'cv' ? $checkable?->cv_no : $checkable?->crf_no,
                'cheque_number' => $checkable?->cheque_number,
                'cheque_amount' => $checkable?->cheque_amount,
                'cheque_date' => $checkable?->cheque_date ? Date::parse($checkable->cheque_date)->format('Y-m-d') : null,
                'payee' => $checkable?->payee,
                'approver_name' => $checkable?->borrowedCheque?->approver->name,
                'borrower_name' => $checkable?->borrowedCheque?->borrower_name,
                'borrower_no' => $checkable?->borrowedCheque?->borrower_no,
                'location' => $checkable?->tagLocation->location,
                'business_unit' => $checkable?->businessUnit->name,
            ];
        });

        return $res->map(
            fn($item) => collect($this->data->get('columns'))
                ->map(fn($column) => $item[$column] ?? null)
                ->all()
        );
    }

    private function getRecords()
    {
        return ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit']])
            ->select('receiver_name', 'status', 'checkable_id', 'checkable_type', 'created_at')
            ->when($this->acronym() === 'pdc', fn($q) =>
                $q->whereHasMorph('checkable', [Cv::class, Crf::class], function ($q, $type) {
                    if ($type === Cv::class) {
                        $q->whereColumn('cheque_date', '>', 'cv_date');
                    } elseif ($type === Crf::class) {
                        $q->whereColumn('cheque_date', '>', 'crf_date');
                    }
                }))

            //! NO FILTERING FOR VSS
            ->when(
                $this->acronym() === 'rc',
                fn($q) =>
                    $q->where('status', 'released')
            )
            ->when(
                $this->acronym() === 'cc',
                fn($q) =>
                    $q->where('status', 'cancelled')
            )
            ->when(
                $this->acronym() === 'fc',
                fn($q) =>
                    $q->whereHas('chequeForwardedStatus', function ($q) {
                        $q->where('status', 'released');
                    })->when(
                            !empty($this->data['forwardedLocations']),
                            fn($outerQuery) =>
                                $outerQuery->whereHasMorph(
                                    'checkable',
                                    [Cv::class, Crf::class],
                                    function (Builder $query) {
                                        $query->whereHas('tagLocation', function (Builder $query) {
                                            $query->whereIn('location', $this->data['forwardedLocations']);
                                        });
                                    }
                                )
                        )
            )

            ->when(
                $this->acronym() === 'sc',
                fn($q) =>
                    $q->whereHasMorph('checkable', [Cv::class, Crf::class], function ($q, $type) {
                        $q->where('cheque_date', '<', now()->subMonths(6));
                    })
            )
            ->when(
                $this->acronym() === 'ic',
                fn($q) =>
                    $q->where('status', 'released')
                        ->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            function (Builder $query) {
                                $query->whereHas('tagLocation', function (Builder $query) {
                                    $query->where('location', 'Internal');
                                });
                            }
                        )

            )
            ->when(
                $this->acronym() === 'dc',
                fn($q) =>
                    $q->where('status', 'released')
                        ->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            function (Builder $query) {
                                $query->whereHas('tagLocation', function (Builder $query) {
                                    $query->where('location', 'Deposit');
                                });
                            }
                        )
            )
            ->when(
                $this->acronym() === 'tpc',
                fn($q) =>
                    $q->where('status', 'released')
                        ->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            function (Builder $query) {
                                $query->whereHas('tagLocation', function (Builder $query) {
                                    $query->where('location', 'Tagbilaran Pick-up');
                                });
                            }
                        )
            )

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
            ->when(
                !empty($this->data['bu']) && !in_array('All', $this->data['bu']),
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

    function acronym(): string
    {
        return collect(explode(' ', $this->title))
            ->map(fn($word) => Str::lower(Str::substr($word, 0, 1)))
            ->implode('');
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
