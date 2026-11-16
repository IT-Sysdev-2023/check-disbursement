<?php

namespace App\Jobs;

use App\Enums\ProgressStatus;
use App\Events\ReportProgress;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ReportCompletedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(protected int $userId, )
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        ReportProgress::dispatch(
            $this->userId,
            'Report Completed',
            ProgressStatus::Finished
        );
    }
}
