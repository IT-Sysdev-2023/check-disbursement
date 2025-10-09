<?php

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

    Route::get('retrieve', function () {
        return Inertia::render('retrieveCvCrf');
    })->name('retrieve');

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

  


});
Route::get('retrieve-data', [RetrieveDataController::class, 'index'])->name('retrieveData');
// Route::get('/test', function () {
//     $con = Schema::connection('sqlsrvCaf')->getTables();
//     $tables = collect($con)->filter(function ($table) {
//         return Str::contains($table['name'], 'CRF');
//     });
//     dd($tables);
// })->name('test');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
