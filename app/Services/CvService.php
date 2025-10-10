<?php

namespace App\Services;
use App\Models\NavDatabase;
use App\Models\NavDbName;
use App\Models\NavServer;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
class CvService
{
    /**
     * Create a new class instance.
     */
    public function retrieveData()
    {
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->withWhereHas('navTable');
            })
            ->lazy();

        $nav->each(function ($server) {
            $server->navDatabases->each(function ($db) use ($server) {
                $con = self::getConnection($server->name, $server->port, $server->username, $server->password, $db->name);

                self::store($con, $db->navTable);
            });
        });
    }

    private function store($connection, $table)
    {
        if ($table) {
            $connection
                ->table($table->name)
                ->orderBy('CV No_')
                ->chunkById(100, function ($cv) use ($table) {
                    $data = $cv->map(
                        fn($item) =>
                        [
                            'nav_table_id' => $table->id,
                            'cv_number' => $item->{'CV No_'},
                            'check_number' => $item->{'Check Number'},
                            'check_amount' => $item->{'Check Amount'},
                            'check_date' => $item->{'Check Date'} ? Date::parse($item->{'Check Date'}) : null,
                            'payee' => $item->{'Payee'},
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    )->toArray();
                    DB::table('cvs')->insertOrIgnore($data);
                }, 'CV No_');
        }

    }

    private function getConnection(string $server, int $port, string $username, string $password, string $database)
    {
        // You can get these from .env or from a model ($stlocal)
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

        // Define connection name dynamically
        $connectionName = 'nav';

        // Clear any existing connection cache with the same name
        DB::purge($connectionName);

        // Apply configuration to the runtime
        Config::set("database.connections.{$connectionName}", $config);

        // Return a ready-to-use connection instance
        return DB::connection($connectionName);
    }

    private function checkDatabase()
    {
        //  $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CV');
        // });
        // dd($tables);

         // dd($servers);
        // $con = self::getConnection()->table('CHOWKING ALTA CITTA$CV Check Payment')
        //     ->limit(10)->get();
        // dd($con);
    }
}
