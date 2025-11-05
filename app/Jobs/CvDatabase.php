<?php

namespace App\Jobs;

use App\Events\CvProgress;
use App\Models\NavDatabase;
use App\Models\NavServer;
use App\Models\User;
use App\Services\CvService;
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
    public function __construct(
        public NavServer $server,
        public int $userId,
        public object $date,
        public NavDatabase $database
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Log::info($this->userId);
        // $user = User::find($this->userId)->first();

        (new CvService())
            ->setConnection(
                $this->server,
                $this->database->name
            )
            ->setDateFilter($this->date)
            ->setUser($this->userId)
            ->storeHeaderRecord($this->database->navHeaderTable, $this->database->navLineTable, $this->database->navCheckPaymentTable)
            // ->storeLineRecord($this->database->navLineTable)
            // ->storeCheckPaymentRecord($this->database->navCheckPaymentTable)
            ;


    }

    public function getLine()
    {

    }
}
