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

        $data = collect($this->data);
        $data->put('columns', collect($data->get('columns'))->prepend('date_of_action')->prepend('status')->all())
            ->put('selectedReport', collect($data->get('selectedReport')));

        $sheetReport = $data->get('selectedReport');

        $sheets = [];

        if ($sheetReport->contains('pdc')) {
            $sheets[] = new SheetReportExport($data, 'Post Dated Cheques');
        }

        if ($sheetReport->contains('vss')) {
            $sheets[] = new SheetReportExport($data, 'Voucher Status Summary');
        }

        if ($sheetReport->contains('rc')) {
            $sheets[] = new SheetReportExport($data, 'Released Cheques');
        }

        if ($sheetReport->contains('cc')) {
            $sheets[] = new SheetReportExport($data, 'Cancelled Cheques');
        }

        if ($sheetReport->contains('fc')) {
            $sheets[] = new SheetReportExport($data, 'Forwarded Cheques');
        }

        if ($sheetReport->contains('sc')) {
            $sheets[] = new SheetReportExport($data, 'Staled Cheques');
        }

        if ($sheetReport->contains('ic')) {
            $sheets[] = new SheetReportExport($data, 'Internal Cheques');
        }

        if ($sheetReport->contains('dc')) {
            $sheets[] = new SheetReportExport($data, 'Deposited Cheques');
        }

        if ($sheetReport->contains('tpc')) {
            $sheets[] = new SheetReportExport($data, 'Tagbilaran Pick-up Cheques');
        }

        if (empty($sheets)) {
            throw new InvalidArgumentException(
                'No valid report selected. Expected pdc or vss.'
            );
        }
        return $sheets;
    }
   

}
