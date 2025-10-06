<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('releasing', function () {
        return Inertia::render('releasing');
    })->name('releasing');

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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
