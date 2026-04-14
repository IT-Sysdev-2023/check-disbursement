<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AssignedCheckNumberController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BorrowedCheckController;
use App\Http\Controllers\CheckBorrowingController;
use App\Http\Controllers\CheckReleasingController;
use App\Http\Controllers\CheckRequestController;
use App\Http\Controllers\ClosingController;
use App\Http\Controllers\CrfController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ForwardedCheckController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RetrievedChecksController;
use App\Http\Controllers\ScannedRecordsController;
use App\Http\Controllers\StatusController;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home')->middleware('guest');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('users', [AdminController::class, 'users'])->name('users');

        Route::get('assign/{id}', [AdminController::class, 'assign'])->name('assign');
        Route::get('permissions', [AdminController::class, 'permissions'])->name('permissions');
        Route::post('assign-permissions', [AdminController::class, 'assignPermissions'])->name('assignPermissions');
        Route::post('store-user', [AdminController::class, 'storeUser'])->name('store-user');

        Route::prefix('setup')->group(function () {
            Route::get('bank-setup', [AdminController::class, 'setupBank'])->name('bank-setup');
            Route::get('bank-accout-setup', [AdminController::class, 'setupBankAccount'])->name('bank-account-setup');
            Route::post('store-bank', [AdminController::class, 'storeBank'])->name('store-bank');
            Route::post('store-bank-account', [AdminController::class, 'storeBankAccount'])->name('store-bank-account');
        });
    });

    Route::middleware('role:disbursement_officer|admin')->group(function () {
        //! EXTRACT CHECKS
        Route::prefix('extract')->group(function () {
            Route::get('business-units', [CvController::class, 'businessUnits'])->name('get-business-units');
            Route::prefix('check-voucher')->group(function () {
                Route::get('index', [CvController::class, 'index'])->name('check-voucher');
                Route::post('extract-cv', [CvController::class, 'extractCv'])->name('extract-cv');
            });

            Route::prefix('crf')->group(function () {
                Route::get('index', [CrfController::class, 'index'])->name('check-request-form');
                Route::post('extract-crf', [CrfController::class, 'extractCrf'])->name('extract-crf');

            });

        });

        //! RETRIEVED CHECKS
        Route::prefix('retrieved-checks')->group(function () {
            Route::get('index', [RetrievedChecksController::class, 'index'])->name('retrieved-records');

            Route::get('filter-business-units', [RetrievedChecksController::class, 'businessUnits'])->name('filter-business-units');
            Route::get('get-borrower-names', [BorrowedCheckController::class, 'borrower'])->name('borrower-names');
            Route::post('store-borrow-check', [BorrowedCheckController::class, 'store'])->name('borrow-check');

            Route::get('get-location', [RetrievedChecksController::class, 'getLocation'])->name('get-location');
            Route::put('tag-location', [RetrievedChecksController::class, 'updateLocation'])->name('tag-location');

            Route::get('pending-details/{id}', [BorrowedCheckController::class, 'pendingDetails'])->name('pending-details');
            Route::get('scan', [ScannedRecordsController::class, 'scan'])->name('scan');
            Route::get('get-scanned-records/{id}', [ScannedRecordsController::class, 'getScannedRecords'])->name('get-scanned-records');
            Route::get('get-banks', [BankController::class, 'banks'])->name('banks');
            // Route::put('update-scanned-record/{id}', [ScannedRecordsController::class, 'update'])->name('update-scanned-record');
            Route::post('store-scan-record/{id}', [ScannedRecordsController::class, 'store'])->name('store-scan-record');

            Route::put('update-assign-check-number', [AssignedCheckNumberController::class, 'updateCheckNumber'])->name('update-assign-check-number');
            Route::put('update-assign-check-date', [AssignedCheckNumberController::class, 'updateCheckDate'])->name('update-assign-check-date');

            Route::post('sync-missing-data', [RetrievedChecksController::class, 'syncMissingData'])->name('sync-missing-data');
        });
    });


    Route::prefix('details')->group(function () {
        Route::get('cv/details/{id}', [CvController::class, 'details'])->name('details');
        Route::get('cv/details-signature/{id}', [CvController::class, 'signatureDetails'])->name('signature-details');
        Route::get('crf/details/{id}', [CrfController::class, 'detailsCrf'])->name('details-crf');

        Route::get('scanned-records-amount-checkNo', [StatusController::class, 'scannedRecordsAmountCheckNo'])->name('scanned-records-amount-checkNo');
        Route::get('scanned-records/{id}', [StatusController::class, 'scannedRecords'])->name('scanned-records');
    });

     Route::get('borrowed-checks', [CheckRequestController::class, 'borrowedChecks'])->middleware('role:disbursement_officer|section_head|admin')->name('borrowed-checks');
    
     //! SECTION HEAD
    Route::prefix('section-head')->middleware('role:section_head|admin')->group(function () {

        Route::prefix('check-receiving')->group(function () {
            Route::get('index', [CheckRequestController::class, 'index'])->name('cheque-requests');
            // display cheques from dropdown
            Route::get('borrowed-number-cheques/{id}', [CheckRequestController::class, 'borrowedNumberCheques'])->name('borrowed-number-cheques'); // display number of cheques borrowed
            Route::post('cancel-check', [CheckRequestController::class, 'cancelCheck'])->name('cancel-check');

            Route::get('approver', [CheckRequestController::class, 'approver'])->name('approver-names');
            Route::put('approve-check', [CheckRequestController::class, 'approveCheck'])->name('approve-check');

            Route::put('change-approver', [CheckRequestController::class, 'changeApprover'])->name('change-approver');
        });

        Route::prefix('check-borrowing')->group(function () {
            Route::get('index', [CheckBorrowingController::class, 'index'])->name('check-borrowing');
            Route::put('secondary-borrow', [CheckBorrowingController::class, 'borrow'])->name('secondary-borrow-check');
            Route::put('return-check', [CheckBorrowingController::class, 'returnCheck'])->name('return-checks');
        });

        Route::prefix('check-releasing')->group(function () {
            Route::get('index', [CheckReleasingController::class, 'index'])->name('check-releasing');

            Route::get('release-check/{checkId}/{status}', [CheckReleasingController::class, 'show'])->name('release-check');
            Route::post('store-release-check/{id}', [CheckReleasingController::class, 'store'])->name('store-release-check');
        });
    });

    //! REGIONAL OFFICER
    //Cebu & Manila
    Route::prefix('forwarded-check')->middleware('role:regional_officer|admin')->group(function () {
        Route::get('index', [ForwardedCheckController::class, 'index'])->name('forwarded-check-releasing');
        Route::get('release-check/{id}/{status}', [ForwardedCheckController::class, 'showForwarded'])->name('release-check-forwarded');
        Route::post('store-release-check/{id}', [ForwardedCheckController::class, 'storeReleaseCheck'])->name('store-release-check-forwarded');
        Route::put('update-receiver-{id}', [ForwardedCheckController::class, 'update'])->name('receiver-forwarded');

        Route::get('releasing', [ForwardedCheckController::class, 'forwardedReleasing'])->name('forwarded-releasing');
        Route::post('cancel/{id}', [ForwardedCheckController::class, 'cancelForwarded'])->name('cancel-forwarded');
    });

    Route::prefix('closing-checks')->group(function () {
        Route::get('index', [ClosingController::class, 'index'])->name('closing-checks');
        Route::post('mark-close/{id}', [ClosingController::class, 'close'])->name('mark-as-close');
    });

    Route::get('check-status', [StatusController::class, 'checkStatus'])->name('check-status');
    Route::post('cancel-stale-check/{id}', [StatusController::class, 'cancelStale'])->name('cancel-stale-check');

    Route::prefix('reports')->group(function () {
        Route::get('report', [ReportController::class, 'index'])->name('report');
        Route::post('generate-report', [ReportController::class, 'generate'])->name('generateReport');
        Route::get('generated-reports', [ReportController::class, 'generatedReports'])->name('generatedReport');

        Route::get('download-report', [ReportController::class, 'download'])->name('download-report');
    });

    Route::get('about', function () {
        return Inertia::render('aboutUs/aboutus');
    })->name('about');

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
    $tables = DB::connection('sqlsrvCaf')
        ->select("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");

    dd($tables);


    $con = DB::connection('sqlsrvCaf')
        // ->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->table('SON-OK AGRI FARM$CV Check Payment')
        ->table('ALTURAS GLASS SERVICE$CV Check Payment')

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
