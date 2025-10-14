<?php

namespace App\Services;
use App\Events\CvPercentage;
use App\Events\CvProgress;
use App\Jobs\CvServer;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
class CvService
{
    /**
     * Create a new class instance.
     */
    public function retrieveData(User $user)
    {
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->with('navTable');
            })
            ->lazy();
        $id = $user->id;
        
        $nav->each(function (NavServer $server) use  ($id) {
            CvServer::dispatch($server, $id);
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
