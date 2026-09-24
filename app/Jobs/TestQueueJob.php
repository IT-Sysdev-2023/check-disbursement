<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class TestQueueJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Log::info('QUEUE IS WORKING!', [
            'time' => now()->toDateTimeString(),
        ]);
    }
}