<?php

namespace App\Services;

use App\Events\CvProgress;
use App\Jobs\CvServer;
use App\Models\Cv;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
class CvService
{
    /**
     * Create a new class instance.
     */
    public function retrieveData(User $user, object $date)
    {
        // Get all the Navition Servers
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->with('navTable');
            })
            ->lazy();

        $id = $user->id;
        $nav->each(
            fn(NavServer $server) =>
            CvServer::dispatch($server, $id, $date)
        );


    }

    public function cvs(?int $page)
    {
        return Inertia::render('retrieveCvCrf', [
            'cv' => Cv::paginate($page)
        ]);
    }

    public function details(Cv $cv){
        return Inertia::render('dashboard/cv/cvDetails', [
            'cv' => $cv
        ]);
    }

    private function checkDatabase()
    {
        //  $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CV');
        // });
        // dd($tables);

        // dd($servers);
        // $start = "2017-08-05";
        // $end = "2017-09-08";
        // $con = DB::connection('sqlsrvCaf')->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        // ->limit(10)->get();
        // dd($con);
    }
}
