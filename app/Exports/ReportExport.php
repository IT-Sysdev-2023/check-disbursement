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
    protected ?array $cvColumns;
    protected ?array $crfColumns;


    public function __construct($cvColumns, $crfColumns, $data)
    {
        $this->cvColumns = $cvColumns;
        $this->crfColumns = $crfColumns;
        $this->data = $data;
    }
    public function sheets(): array
    {
        return [
            new CvReportExport($this->cvColumns, $this->data),
            new CrfReportExport($this->crfColumns, $this->data),
        ];
    }
}
