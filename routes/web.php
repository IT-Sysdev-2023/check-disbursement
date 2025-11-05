<?php

use App\Http\Controllers\CvController;
use App\Http\Controllers\RetrieveDataController;
use App\Models\CvLine;
use App\Models\User;
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
        Route::get('index', 'retrieveCv')->name('retrieve');
        Route::get('details/{id}', 'details')->name('details');
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
    $con = DB::connection('sqlsrvCaf')
    // ->table('ALTA CITTA ACCOUNTING$CV Check Payment')
    ->table('CARMEN AGRI FARM$CV Check Payment')
    // $head = $con->table('ALTA CITTA ACCOUNTING$CV Header')

    // // ->where('CV Status', "")//CV25080289
    // // ->where('CV No_', "CRF0000002")//CV25080289
    // // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
    ->first();
    dd($con);
    $str = [];
    // $line = $con->table('CARMEN AGRI FARM$CV Line')
    //     // ->limit(10)->get();
    //     ->orderBy('CV No_')
    //     ->chunkById(500, function ($cv) use (&$str) {
    //         $data = $cv->map(
    //             function ($item) use (&$str) {

    //                 $str[] = [
    //                     'cv_header_id' => 1,
    //                     'line_no' => $item->{'Line No_'},
    //                     'crf_no' => $item->{'CRF No_'},
    //                     'document_no' => $item->{'Document No_'},
    //                     'gl_entry_no' => $item->{'G_L Entry No_'},
    //                     'forwarded_amount' => $item->{'Forwarded Amount'},
    //                     'paid_amount' => $item->{'Paid Amount'},
    //                     'balance' => $item->{'Balance'},
    //                     'document_type' => $item->{'Document Type'},
    //                     'applies_to_doc_no' => $item->{'Applies To Doc_ No_'},
    //                     'invoice_no' => $item->{'Invoice No_'},
    //                     'account_name' => $item->{'Account Name'},
    //                     'company_dimension_code' => $item->{'Company Dimension Code'},
    //                     'department_dimension_code' => $item->{'Department Dimension Code'},
    //                     'payment_type' => $item->{'Payment Type'},
    //                     'created_at' => now(),
    //                     'updated_at' => now(),
    //                 ];


    //             }
    //         )->toArray();

    //         // DB::table('cv_lines')->insertOrIgnore($data);
    
    //     }, 'CV No_');
    // $check = $con->table('ALTA CITTA ACCOUNTING$CV Check Payment')
    // ->first();
//  DB::table('cv_lines')->insertOrIgnore($str);

    // dd($str);
})->name('test');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
