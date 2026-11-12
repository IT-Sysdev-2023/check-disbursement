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

        $hasPdc = self::doesReportExist($data, 'pdc');
        $hasVss = self::doesReportExist($data, 'vss');
        $releasedCheques = self::doesReportExist($data, 'rc');
        $cancelledCheques = self::doesReportExist($data, 'cc');
        $forwarded = self::doesReportExist($data, 'forwarded');
        $staleCheques = self::doesReportExist($data, 'sc');
        $internal = self::doesReportExist($data, 'internal');
        $depositedCheques = self::doesReportExist($data, 'dc');
        $pickup = self::doesReportExist($data, 'pickup');

        if ($hasPdc) {
            $sheets[] = new PdcReportExport($this->data);
        }

        if ($hasVss) {
            $sheets[] = new VoucherStatusSummaryExport($this->data);
        }
        if ($releasedCheques) {
            $sheets[] = new ReleasedChequesExport($this->data);
        }

        if ($cancelledCheques) {
            $sheets[] = new CancelledChequesExport($this->data);
        }

        if ($forwarded) {
            $sheets[] = new ForwardedChequesExport($this->data);
        }
        if ($staleCheques) {
            $sheets[] = new StaleChequesExport($this->data);
        }
        if ($internal) {
            $sheets[] = new InternalChequesExport($this->data);
        }

        if ($depositedCheques) {
            $sheets[] = new DepositedChequesExport($this->data);
        }
        if ($pickup) {
            $sheets[] = new PickupChequesExport($this->data);
        }

        if (empty($sheets)) {
            throw new InvalidArgumentException(
                'No valid report selected. Expected pdc or vss.'
            );
        }
        return $sheets;
    }
    //     4 => "internal"
//     5 => "dc"
//     8 => "pickup"
    private static function doesReportExist($data, $report)
    {
        return $data->contains(
            fn($item) => ($item ?? null) === $report
        );
    }

}
