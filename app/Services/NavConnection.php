<?php

namespace App\Services;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class NavConnection
{
    protected static array $cache = [];
    public static function getConnection(string $server, int $port, string $username, string $password, string $database)
    {

        $key = "{$server}_{$database}";

        if (!isset(self::$cache[$key])) {
            $connectionName = 'nav_' . $key;

            $config = [
                'driver' => 'sqlsrv',
                'host' => $server,
                'port' => $port,
                'database' => $database,
                'username' => $username,
                'password' => $password,
                'charset' => 'utf8',
                'prefix' => '',
                'trust_server_certificate' => true,
            ];

            // Apply configuration to the runtime
            Config::set("database.connections.{$connectionName}", $config);
            self::$cache[$key] = DB::connection($connectionName);
        }

        return self::$cache[$key];
    }
}