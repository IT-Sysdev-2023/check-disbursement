<?php

namespace App\Services;
use App\Models\NavServer;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

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

    public function filterHeaderRecord(string $name)
    {
        $record = $this->connection->table($name)
            ->whereRaw("CONVERT(VARCHAR(10), [CV Date], 120) BETWEEN ? AND ?", [$this->dateFilter->start, $this->dateFilter->end]);

        return $record;
    }
    public function getLineRecord()
    {

    }
    public function getCheckPaymentRecord()
    {

    }


}