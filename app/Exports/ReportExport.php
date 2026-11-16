<?php

namespace App\Exports;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReportExport implements WithMultipleSheets, ShouldQueue
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected array $data;
    protected int $userId;


    public function __construct($data, int $userId)
    {
        $this->data = $data;
        $this->userId = $userId;
    }
    public function sheets(): array
    {

        $data = collect($this->data);
        $data->put('columns', collect($data->get('columns'))->prepend('date_of_action')->prepend('status')->all())
            ->put('selectedReport', collect($data->get('selectedReport')));

        $sheetReport = $data->get('selectedReport');

        $sheets = [];

        if ($sheetReport->contains('pdc')) {
            $sheets[] = new SheetReportExport($data, 'Post Dated Cheques', $this->userId);
        }

        if ($sheetReport->contains('vss')) {
            $sheets[] = new SheetReportExport($data, 'Voucher Status Summary', $this->userId);
        }

        if ($sheetReport->contains('rc')) {
            $sheets[] = new SheetReportExport($data, 'Released Cheques', $this->userId);
        }

        if ($sheetReport->contains('cc')) {
            $sheets[] = new SheetReportExport($data, 'Cancelled Cheques', $this->userId);
        }

        if ($sheetReport->contains('fc')) {
            $sheets[] = new SheetReportExport($data, 'Forwarded Cheques', $this->userId);
        }

        if ($sheetReport->contains('sc')) {
            $sheets[] = new SheetReportExport($data, 'Staled Cheques', $this->userId);
        }

        if ($sheetReport->contains('ic')) {
            $sheets[] = new SheetReportExport($data, 'Internal Cheques', $this->userId);
        }

        if ($sheetReport->contains('dc')) {
            $sheets[] = new SheetReportExport($data, 'Deposited Cheques', $this->userId);
        }

        if ($sheetReport->contains('tpc')) {
            $sheets[] = new SheetReportExport($data, 'Tagbilaran Pick-up Cheques', $this->userId);
        }

        if (empty($sheets)) {
            throw new InvalidArgumentException(
                'No valid report selected. Expected pdc or vss.'
            );
        }
        return $sheets;
    }


}
