<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssignedCheckNumberController;
use App\Http\Controllers\BorrowedCheckController;
use App\Http\Controllers\CheckReleasingController;
use App\Http\Controllers\CrfController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RetrieveDataController;
use App\Http\Controllers\RetrievedChecksController;
use App\Http\Controllers\ScannedRecordsController;
use App\Http\Controllers\StatusController;
use App\Models\BorrowedCheck;
use App\Models\Company;
use App\Models\CompanyPermission;
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
})->name('home')->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //! EXTRACT CHECKS
    Route::prefix('extract')->group(function () {

        Route::prefix('check-voucher')->group(function () {
            Route::get('index', [CvController::class, 'index'])->name('check-voucher');
            Route::post('extract-cv', [CvController::class, 'extractCv'])->name('extractCv');
        });

        Route::prefix('crf')->group(function () {
            Route::get('index', [CrfController::class, 'index'])->name('check-request-form');
            Route::post('extract-crf', [CrfController::class, 'extractCrf'])->name('extractCrf');

        });

    });

    //! RETRIEVED CHECKS
    Route::prefix('retrieved-checks')->group(function () {
        Route::get('index', [RetrievedChecksController::class, 'index'])->name('retrievedRecords');

        Route::get('get-borrower-names', [BorrowedCheckController::class, 'borrowerNames'])->name('borrowerNames');
        Route::post('store-borrow-check', [BorrowedCheckController::class, 'store'])->name('borrowCheck');
        Route::get('borrowed-checks', [BorrowedCheckController::class, 'index'])->name('borrowedChecks');
        
        Route::get('approver', [RetrievedChecksController::class, 'approver'])->name('approverNames');
        Route::put('approve-check', [RetrievedChecksController::class, 'approveCheck'])->name('approveCheck');
        Route::get('get-location', [RetrievedChecksController::class, 'getLocation'])->name('getLocation');
        Route::put('update-location', [RetrievedChecksController::class, 'setLocation'])->name('updateLocation');

        Route::get('scan', [ScannedRecordsController::class, 'scan'])->name('scan');
        Route::get('unassign-check/{id}', [AssignedCheckNumberController::class, 'show'])->name('unassignCheck');
        Route::post('store-unassign-check-number', [AssignedCheckNumberController::class, 'store'])->name('storeUnassignCheck');
        Route::get('cv/details/{id}', [CvController::class, 'details'])->name('details');
        Route::get('crf/details/{id}', [CrfController::class, 'detailsCrf'])->name('detailsCrf');
    });

    //! CHECK RELEASING
    Route::prefix('check-releasing')->group(function () {

        Route::get('index', [CheckReleasingController::class, 'index'])->name('check-releasing');
        Route::get('release-check/{checkId}/{status}/{check}', [CheckReleasingController::class, 'show'])->name('release-check');
        Route::post('store-release-check', [CheckReleasingController::class, 'store'])->name('store-release-check');
        Route::post('cancel-check/{id}', [CheckReleasingController::class, 'cancel'])->name('cancel-check');
    });

    Route::get('check-status', [StatusController::class, 'checkStatus'])->name('check-status');
    Route::put('update-status/{id}', [StatusController::class, 'updateStatus'])->name('update-status');

    // Route::get('report', function () {
    //     return Inertia::render('crud-dashboard/CrudDashboard');
    // })->name('report');

    Route::get('report', function () {
        return Inertia::render('retrievedData/employeeList');
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

    Route::prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users'])->name('users');

        Route::get('permissions', [AdminController::class, 'permissions'])->name('permissions');
        Route::post('assign-permissions', [AdminController::class, 'assignPermissions'])->name('assignPermissions');
    });



});
Route::get('/test', function () {
    // $con = Schema::connection('sqlsrvCaf')->getTables();
    // $tables = collect($con)->filter(function ($table) {
    //     return Str::contains($table['name'], 'CV');
    // });
    // dd($tables);

    $start = "2025-11-03";
    $end = "2025-11-04";
    //     $tables = DB::connection('sqlsrvCaf')
//     ->select("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");

    // dd($tables);


    $con = DB::connection('sqlsrvCaf')
        // ->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->table('SON-OK AGRI FARM$CV Check Payment')
        ->table('PLANNING & CONSTRUCTION ACCTG$CV Check Payment')

        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        // ->where('Check Class Location', '==',  '!=', '')
        // ->whereNot(function ($query) {

        //     $query->where('Check Class Location', '');

        // })
        ->limit(10)
        ->get();
    // $con1 = DB::connection('sqlsrvCaf')
    // ->table('CARMEN AGRI FARM$CV Line')
    // ->where('CV No_', "CRF0000118")//CV25080289
    // // // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
    // ->get();
    // $con2 = DB::connection('sqlsrvCaf')
    // ->table('CARMEN AGRI FARM$CV Check Payment')
    // // ->where('CV No_', "CRF0000118")//CV25080289
    // // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
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

Route::get('/company', function (Request $request) {

    // $admin = Role::first();
    // $admin->givePermissionTo(Permission::all());

    $ret = Company::select('id')->get();

    $ret->each(function ($item) use ($request) {
        Auth::user()->companyPermission()->create(['company_id' => $item->id]);
    });
    dd();
})->name('company');

Route::get('permission', function () {
    $r = User::where('id', 1)->first()->assignRole('admin');

    dd($r);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
