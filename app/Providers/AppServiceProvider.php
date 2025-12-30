<?php

namespace App\Providers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
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
