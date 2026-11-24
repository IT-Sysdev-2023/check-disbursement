<?php

namespace App\Exports;


use App\Enums\ProgressStatus;
use App\Events\ReportProgress;
use App\Models\BorrowedCheque;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithMapping;
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
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterChunk;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;

class SheetReportExport implements FromQuery, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    /**
     * @return Collection
     */
    protected Collection $data;
    protected int $totalItems = 0;
    protected int $currentIndex = 0;
    protected int $userId;
    protected string $title;
    public function __construct(Collection $data, string $title, int $userId)
    {
        $this->data = $data;
        $this->title = $title;
        $this->userId = $userId;
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

    public function query(): Builder
    {
        $query = $this->getRecords();
        $this->totalItems = (clone $query)->count();
        return $query;
    }

    public function map($item): array
    {
        $checkable = $item->checkable;
        $record = [
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

        ReportProgress::dispatch($this->userId, "Generating {$this->title}...", ProgressStatus::Processing, $this->currentIndex++, $this->totalItems, $this->acronym());

        return collect($this->data->get('columns'))
            ->map(fn($column) => $record[$column] ?? null)
            ->all();
    }

    private function getRecords()
    {
        // $cheque = BorrowedCheque::query()
        //     ->regionalPermission()
        //     ->join('scanned_records as sr', 'sr.borrowed_cheque_id', 'borrowed_cheques.id')
        //     ->when(
        //         !empty($this->data['startDate']),
        //         fn($query) => $query->whereDate(
        //             'sr.created_at',
        //             '>=',
        //             $this->data['startDate']
        //         )
        //     )
        //     ->when(
        //         !empty($this->data['endDate']),
        //         fn($query) => $query->whereDate(
        //             'sr.created_at',
        //             '<=',
        //             $this->data['endDate']
        //         )
        //     )
        //     ->when(
        //         !empty($this->data['bu']) && !in_array('All', $this->data['bu']),
        //         fn($outerQuery) =>
        //             $outerQuery->whereHasMorph(
        //                 'checkable',
        //                 [Cv::class, Crf::class],
        //                 function (Builder $query) {
        //                     $query->whereHas('businessUnit.company', function (Builder $query) {
        //                         $query->whereIn('name', $this->data['bu']);
        //                     });
        //                 }
        //             )
        //     );


        return ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit']])
            ->select('id', 'receiver_name', 'status', 'checkable_id', 'checkable_type', 'created_at')
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
            ->when(
                $this->acronym() === 'pdc', //Post Dated
                fn($q) =>
                    $q->whereHasMorph('checkable', [Cv::class, Crf::class], function ($q, $type) {
                        if ($type === Cv::class) {
                            $q->whereColumn('cheque_date', '>', 'cv_date');
                        } elseif ($type === Crf::class) {
                            $q->whereColumn('cheque_date', '>', 'crf_date');
                        }
                    })
            )

            //! NO FILTERING FOR VSS
            ->when(
                $this->acronym() === 'rc', //Released
                fn($q) =>
                    $q->where('status', 'released')
            )
            ->when(
                $this->acronym() === 'cc', //Cancelled
                fn($q) =>
                    $q->where('status', 'cancelled')
            )
            ->when(
                $this->acronym() === 'fc', //Forwarded
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
                $this->acronym() === 'sc', // Staled 
                fn($q) =>
                    $q->whereHasMorph('checkable', [Cv::class, Crf::class], function ($q, $type) {
                        $q->where('cheque_date', '<', now()->subMonths(6));
                    })
            )
            ->when(
                $this->acronym() === 'ic', //Internal
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
                $this->acronym() === 'dc', //Deposited
                fn($q) =>
                    $q->where('status', 'deposited')
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
                $this->acronym() === 'tpc', //Tagbilaran Pick-up
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
            );
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
