<?php

namespace App\Services;
use App\Jobs\CvServer;
use App\Models\NavServer;
use Illuminate\Contracts\Database\Query\Builder;
class CvService
{
    /**
     * Create a new class instance.
     */
    public function retrieveData()
    {
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->with('navTable');
            })
            ->lazy();

        $nav->each(function (NavServer $server) {
            CvServer::dispatch($server);
        });
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
