<?php

namespace App\Http\Controllers;

use App\Models\NavDatabase;
use App\Models\NavDbName;
use App\Models\NavServer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RetrieveDataController extends Controller
{
    public function index()
    {
        // $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CV');
        // });
        // dd($tables);

        $databaseNames = NavDatabase::get();
        dd($databaseNames);

        // $servers = NavServer::with('navDbNames.navDbTable')->first()->navDbNames->first();

        // dd($servers);
        // $con = self::getConnection()->table('CHOWKING ALTA CITTA$CV Check Payment')
        //     ->limit(10)->get();
        // dd($con);

        $con = DB::connection('sqlsrvCaf')
            ->table('CARMEN AGRI FARM$CV Check Payment')
            ->orderBy('CV No_')
            ->chunkById(100, function ($headers) {
                $data = $headers->map(function ($item) {
                    return [
                        'nav_table_id' => 1,
                        'cv_number' => $item->{'CV No_'},
                        'check_number' => $item->{'Check Number'},
                        'check_amount' => $item->{'Check Amount'},
                        'check_date' => $item->{'Check Date'} ? Date::parse($item->{'Check Date'}) : null,
                        'payee' => $item->{'Payee'},
                        'created_at' => now(),
                        'updated_at' => now(),

                    ];
                })->toArray();
                // dd($data);
                // Single bulk insert per chunk
                DB::table('cvs')->insertOrIgnore($data);

            }, 'CV No_');



        dd($con);

    }
    private function getConnection()
    {
        // You can get these from .env or from a model ($stlocal)
        $config = [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST_CAF', '172.16.161.11'),
            'port' => env('DB_PORT_CAF', '1433'),
            'database' => 'CHOWKING_ALTACITTA_ACCTG',
            'username' => env('DB_USERNAME_CAF', 'super'),
            'password' => env('DB_PASSWORD_CAF', 'fsasya1941'),
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
}
