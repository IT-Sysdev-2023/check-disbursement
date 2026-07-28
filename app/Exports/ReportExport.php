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
        return [
            new CvReportExport($this->data),
            // new CrfReportExport($this->crfColumns, $this->data),
        ];
    }
}
