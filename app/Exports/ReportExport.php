<?php

namespace App\Exports;

use InvalidArgumentException;
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
        $data = collect($this->data['selectedReport']);
        $sheets = [];
        $hasPdc = $data->contains(
            fn($item) => ($item ?? null) === 'pdc'
        );

        $hasVss = $data->contains(
            fn($item) => ($item ?? null) === 'vss'
        );

        if ($hasPdc) {
            $sheets[] = new PdcReportExport($this->data);
        }

        if ($hasVss) {
            $sheets[] = new VoucherStatusSummaryExport($this->data);
        }
        
        if (empty($sheets)) {
            throw new InvalidArgumentException(
                'No valid report selected. Expected pdc or vss.'
            );
        }
        return $sheets;


    }

}
