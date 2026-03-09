<?php

namespace App\Jobs;

use App\Events\CvProgress;
use App\Models\NavDatabase;
use App\Models\NavServer;
use App\Models\User;
use App\Services\CvService;
use App\Services\GenerateCvService;
use App\Services\NavConnection;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Log;

class CvDatabase implements ShouldQueue
{
    use Batchable, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $serverId,
        public int $userId,
        public object $date,
        public int $dbId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        if ($this->batch()?->cancelled()) {
            return;
        }

        $server = NavServer::findOrFail($this->serverId);
        $table = NavDatabase::findOrFail($this->dbId)->load('navHeaderTable', 'navLineTable', 'navCheckPaymentTable', 'businessUnit');

        (new GenerateCvService())
            ->setConnection(
                $server,
                $table->name
            )
            ->setDateFilter($this->date)
            ->setUser($this->userId)
            ->storeRecord(
                $table->navHeaderTable,
                $table->navLineTable?->name,
                $table->navCheckPaymentTable?->name,
                $table->business_unit_id,
                $table->businessUnit->name
            );
    }
}
