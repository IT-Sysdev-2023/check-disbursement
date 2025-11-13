<?php

use App\Http\Controllers\CrfController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\RetrieveDataController;
use App\Models\Company;
use App\Models\Crf;
use App\Models\CvLine;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('check-voucher')->controller(CvController::class)->group(function () {

        Route::get('index', 'index')->name('check-voucher');
        Route::post('extract-cv', 'extractCv')->name('extractCv');

        Route::get('retrieved', 'retrievedCv')->name('retrievedRecords');
        Route::get('details/{id}', 'details')->name('details');
    });

    Route::prefix('crf')->controller(CrfController::class)->group(function () {

        Route::get('index', 'index')->name('check-request-form');
        Route::post('extract-crf', 'extractCrf')->name('extractCrf');

        Route::get('retrieved', 'retrievedCrf')->name('retrieveCrf');
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

});
Route::get('/test', function () {
    // $con = Schema::connection('sqlsrvCaf')->getTables();
    // $tables = collect($con)->filter(function ($table) {
    //     return Str::contains($table['name'], 'CV');
    // });
    // dd($tables);

    $start = "2025-11-03";
    $end = "2025-11-04";
    $con = DB::connection('sqlsrvCaf')
        // ->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        ->table('MFI_CORTES_PIGGERY_ACCTG$CV Line')
        // $head = $con->table('ALTA CITTA ACCOUNTING$CV Header')

        // // ->where('CV Status', "")//CV25080289
        ->whereIn('CV No_', [
            "CRF2511001",
            "CRF2511002",
            "CRF2511003",
            "CRF2511004",
            "CRF2511005",
            "CRF2511006",
            "CRF2511007",
            "CRF2511008",
            "CRF2511009",
            "CRF2511010",
            "CRF2511011",
            "CRF2511012",
            "CRF2511013",
            "CRF2511014",
            "CRF2511015",
            "CRF2511016",
        ])//CV25080289
        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        ->count();
    // $con1 = DB::connection('sqlsrvCaf')
    // ->table('CARMEN AGRI FARM$CV Line')
    // ->where('CV No_', "CRF0000118")//CV25080289
    // // // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
    // ->get();
    // $con2 = DB::connection('sqlsrvCaf')
    // ->table('CARMEN AGRI FARM$CV Check Payment')
    // // ->where('CV No_', "CRF0000118")//CV25080289
    // // // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
    // ->first();
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

Route::get('/company', function () {
    // $ret = Company::select('name')->get();

    // $ret->each(function ($item) {
    //     Permission::create(['name' => $item->name]);
    // });

    $admin = Role::first();
    $admin->givePermissionTo(Permission::all());
})->name('company');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
