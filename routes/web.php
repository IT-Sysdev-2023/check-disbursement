<?php

use App\Http\Controllers\CvController;
use App\Http\Controllers\RetrieveDataController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('check-voucher', function () {
        return Inertia::render('extract/checkVoucher');
    })->name('check-voucher');

    Route::get('check-request-form', function () {
        return Inertia::render('extract/checkRequestForm');
    })->name('check-request-form');

    
    Route::prefix('retrieve')->controller(CvController::class)->group(function () {
        Route::get('index',  'retrieveCv')->name('retrieve');
        Route::get('details/{id}',  'details')->name('details');
    });
    Route::get('check-status', function () {
        return Inertia::render('dashboard');
    })->name('check-status');

    Route::get('report', function () {
        return Inertia::render('dashboard');
    })->name('report');

    Route::get('about', function () {
        return Inertia::render('dashboard');
    })->name('about');

    Route::get('change-password', function () {
        return Inertia::render('dashboard');
    })->name('change-password');

    Route::get('notifications', function () {
        return Inertia::render('dashboard');
    })->name('notifications');

  
    Route::post('retrieve-check-voucher', [CvController::class, 'index'])->name('retrieveCheckVoucher');


});
Route::get('/test', function () {
    // $con = Schema::connection('sqlsrvCaf')->getTables();
    // $tables = collect($con)->filter(function ($table) {
    //     return Str::contains($table['name'], 'CV');
    // });
    // dd($tables);
        $start = "2017-08-05";
        $end = "2017-09-08";
    $con = DB::connection('sqlsrvCaf');
        // ->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->table('ALTA CITTA ACCOUNTING$CV Line')
        $head = $con->table('ALTA CITTA ACCOUNTING$CV Header')

        // ->where('CV Status', "")//CV25080289
        // ->where('CV No_', "CRF0000002")//CV25080289
        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        ->first();
        $line = $con->table('ALTA CITTA ACCOUNTING$CV Line')
        ->first();
        $check = $con->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        ->first();



        dd($head, $line, $check);
})->name('test');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
