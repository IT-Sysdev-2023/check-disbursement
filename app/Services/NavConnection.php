<?php

namespace App\Services;
use App\Models\CvHeader;
use App\Models\NavServer;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NavConnection
{

    protected $connection;

    protected object $dateFilter;

    protected array $missingCheques = [];
    protected static array $cache = [];
    public function setConnection(NavServer $server, string $database)
    {
        $key = "{$server->name}_{$database}";
        if (!isset(self::$cache[$key])) {
            $connectionName = 'nav_' . $key;

            $config = [
                'driver' => 'sqlsrv',
                'host' => $server->name,
                'port' => $server->port,
                'database' => $database,
                'username' => $server->username,
                'password' => $server->password,
                'charset' => 'utf8',
                'prefix' => '',
                'trust_server_certificate' => true,
            ];

            // Apply configuration to the runtime
            Config::set("database.connections.{$connectionName}", $config);
            self::$cache[$key] = DB::connection($connectionName);
        }

        $this->connection = self::$cache[$key];
        return $this;
    }

    public function navRecords(int $buId, string $bu, string $tableName, string $month, string $year)
    {
        $existingDates = CvHeader::
            selectRaw("cv_date as date, cv_no")
            ->whereYear('cv_date', $year)
            ->whereMonth('cv_date', $month)
            ->get();

        $existingKeys = $existingDates->map(function ($item) {
            return $item->cv_no . '-' . $item->date;
        })->toArray();

        $data = $this->connection->table($tableName)
            ->selectRaw("DISTINCT [CV Date] as date, [Check Voucher No_] as cv_no")
            ->whereYear('CV Date', $year)
            ->whereMonth('CV Date', $month)
            ->get()
            ->reject(function ($item) use ($existingKeys) { // EXCLUDE EXISTING RECORDS IN DATABASE
                $formattedDate = Date::parse($item->date)->format('Y-m-d');
                return in_array($item->cv_no . '-' . $formattedDate, $existingKeys);
            })
            ->groupBy(function ($item) { // GROUP BY MONTH AND YEAR
                return Date::parse($item->date)->format('Y-m-d');
            })
            ->map(function ($items) use ($bu, $buId) {
                return (object) [
                    'date' => Date::parse($items->first()->date)->format('Y-m-d'),
                    'business_unit' => $bu,
                    'buId' => $buId,
                    'crf_total' => 0,
                    'cv_total' => $items->count(),
                    'total' => $items->count(),
                ];
            })
            ->groupBy('business_unit');
        // ->groupBy(function ($item, $date) {
        //     return substr($date, 0, 7); // "YYYY-MM"
        // });
        return $data;
    }

    public function getNavMissingRecords(int $buId, string $tableName, string $month, string $year)
    {
        $existingCv = CvHeader::query()
            ->whereHas('cvCheckPayment', function ($q) use ($buId) {
                $q->where('business_unit_id', $buId);
            })
            ->whereYear('cv_date', $year)
            ->whereMonth('cv_date', $month)
            ->pluck('cv_no')
            ->flip();

        $data = $this->connection->table($tableName)
            ->selectRaw("[Check Voucher No_] as cv_no")
            ->whereYear('CV Date', $year)
            ->whereMonth('CV Date', $month)
            ->get()
            ->reject(fn($row) => isset($existingCv[$row->cv_no]))
            ->pluck('cv_no');

        return $data->toArray();
    }

    public function countNavRecords(string $tableName, string $monthYear): int
    {
        [$year, $month] = explode('-', $monthYear);

        return $this->connection->table($tableName)
            ->whereYear('CV Date', $year)
            ->whereMonth('CV Date', $month)
            ->distinct()
            ->count('Check Voucher No_');
    }
    public function headerConnection(string $name): mixed
    {
        Log::info('Missing Cheques:', $this->missingCheques);
        $record = $this->connection->table($name)
            ->when(!empty($this->missingCheques), function ($query) {
                $query->whereIn('Check Voucher No_', $this->missingCheques);
            })
            ->when(isset($this->dateFilter->month, $this->dateFilter->year), function ($query) { // DATA SYNC BY MONTH AND YEAR
                $query->whereYear('CV Date', $this->dateFilter->year)
                    ->whereMonth('CV Date', $this->dateFilter->month);
            }, function ($query) { //EXTRACT DATA BY DATE RANGE
                $query->whereRaw("CONVERT(VARCHAR(10), [CV Date], 120) BETWEEN ? AND ?", [$this->dateFilter->start, $this->dateFilter->end]);
            })
            ->orderBy('Check Voucher No_');

        return $record;
    }
    public function lineConnection(string $name)
    {
        $record = $this->connection->table($name);
        return $record;
    }
    public function checkPaymentConnection(string $name)
    {
        $record = $this->connection->table($name);
        return $record;
    }


}