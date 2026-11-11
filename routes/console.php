<?php

use App\Jobs\NotificationJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new NotificationJob())
    ->everyFifteenMinutes()
    ->withoutOverlapping();

Schedule::call(function () {
    DB::table('notifications')
        ->where('created_at', '<', now()->subDays(30))
        ->delete();
})->daily();
