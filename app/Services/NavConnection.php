<?php

namespace App\Services;
use App\Models\NavServer;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NavConnection
{

    protected $connection;

    protected object $dateFilter;
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
        return $this->connection->table($tableName)
            ->selectRaw("[CV Date] as date, count(*) as total")
            ->whereYear('CV Date', $year)
            ->whereMonth('CV Date', $month)
            ->groupBy('CV Date')
            ->get()
            ->map(function ($item) use ($bu, $buId) {
                $item->date = Date::parse($item->date)->format('Y-m-d');
                $item->business_unit = $bu;
                $item->buId = $buId;
                $item->crf_total = 0;
                $item->cv_total = $item->total;
                return $item;
            })
            ->groupBy(
                fn($q) =>
                Date::parse($q->date)->format('Y-m')
            );
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
        $record = $this->connection->table($name)
            ->whereRaw("CONVERT(VARCHAR(10), [CV Date], 120) BETWEEN ? AND ?", [$this->dateFilter->start, $this->dateFilter->end])
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