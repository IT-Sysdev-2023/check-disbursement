<?php

namespace App\Providers;

use App\Helpers\FileHandler;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(FileHandler::class, function () {
            return new FileHandler(Storage::disk('public'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'cv' => CvCheckPayment::class,
            'crf' => Crf::class,
        ]);
    }
}
