<?php

namespace App\Jobs;

use App\Models\NavServer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Log;

class CvServer implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public NavServer $server)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->server->navDatabases->each(function ($db) {
            CvDatabase::dispatch($this->server, $db);
        });
    }
}
