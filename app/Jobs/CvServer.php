<?php

namespace App\Jobs;

use App\Models\NavDatabase;
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
    public function __construct(
        public int $serverId,
        public int $userId,
        public object $date,
        public $filteredDatabases
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $server = NavServer::find($this->serverId);

        foreach ($this->filteredDatabases as $db) {
            CvDatabase::dispatch($server, $this->userId, $this->date, $db);
        }
    }
}
