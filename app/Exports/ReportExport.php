<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReportExport implements WithMultipleSheets
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected array $data;


    public function __construct($data)
    {
        $this->data = $data;
    }
    public function sheets(): array
    {
        $data = collect($this->data);
        $sheets = [];

        $hasPdc = $data->contains(
            fn($item) => ($item->selectedReport ?? null) === 'pdc'
        );

        $hasVss = $data->contains(
            fn($item) => ($item->selectedReport ?? null) === 'vss'
        );

        if ($hasPdc) {
            $sheets[] = new PdcReportExport($this->data);
        }

        if ($hasVss) {
            $sheets[] = new VoucherStatusSummaryExport($this->data);
        }

        return $sheets;


    }

}
