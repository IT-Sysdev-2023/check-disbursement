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
    public function __construct(public NavServer $server, public int $userId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->server->navDatabases->each(function ($db) {
            CvDatabase::dispatch($this->server, $this->userId,$db);
        });
    }
}
