<?php

namespace App\Jobs;

use App\Models\NavDatabase;
use App\Models\NavServer;
use App\Services\NavConnection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Log;

class CvDatabase implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public NavServer $server, public NavDatabase $database)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $connection = NavConnection::getConnection(
            $this->server->name,
            $this->server->port,
            $this->server->username,
            $this->server->password,
            $this->database->name
        );

        if ($this->database->navTable)
            $connection
                ->table($this->database->navTable->name)
                ->orderBy('CV No_')
                ->chunkById(500, function ($cv) {
                    $data = $cv->map(
                        fn($item) =>
                        [
                            'nav_table_id' => $this->database->navTable->id,
                            'cv_number' => $item->{'CV No_'},
                            'check_number' => $item->{'Check Number'},
                            'check_amount' => $item->{'Check Amount'},
                            'check_date' => $item->{'Check Date'} ? Date::parse($item->{'Check Date'}) : null,
                            'payee' => $item->{'Payee'},
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    )->toArray();

                    DB::transaction(function () use ($data) {
                        DB::table('cvs')->insertOrIgnore($data);
                    });
                }, 'CV No_');
    }
}
