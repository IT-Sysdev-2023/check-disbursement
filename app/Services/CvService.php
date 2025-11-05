<?php

namespace App\Services;

use App\Events\CvProgress;
use App\Jobs\CvServer;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Models\NavCheckPaymentTable;
use App\Models\NavHeaderTable;
use App\Models\NavLineTable;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use function Pest\Laravel\getConnection;
class CvService extends NavConnection
{
    /**
     * Create a new class instance.
     */


    protected int $userId;

    public function __construct()
    {
    }
    public function retrieveData(User $user, object $date)
    {
        // Get all the Navition Servers
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) {
                $query->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();

        $id = $user->id;

        $nav->each(
            fn(NavServer $server) =>
            CvServer::dispatch($server, $id, $date)
        );
    }

    public function setDateFilter(object $date)
    {
        $this->dateFilter = $date;
        return $this;
    }

    public function storeHeaderRecord(?NavHeaderTable $navHeaderTable, ?NavLineTable $navLineTable, ?NavCheckPaymentTable $navCheckPaymentTable)
    {
        if ($navHeaderTable) {
            $start = 1;

            $tableName = $navHeaderTable->name;
            $tableId = $navHeaderTable->id;
            $header = $this->filterHeaderRecord($tableName);
            $lineDb = $this->filterLineRecord($navLineTable->name);
            $cpDb = $this->filterCheckPaymentRecord($navCheckPaymentTable->name);
            $total = $header->count();

            $header->orderBy('Check Voucher No_')
                ->chunkById(500, function ($cv) use (&$start, $total, $tableName, $tableId, $lineDb, $cpDb) {

                    $cv->each(
                        function ($item) use (&$start, $total, $tableName, $tableId, $lineDb, $cpDb) {

                            CvProgress::dispatch("Generating Cv Header " . $tableName . " in progress.. ", $start, $total, $this->userId);
                            $start++;
                            
                            DB::beginTransaction();
                            $header = [
                                'nav_header_table_id' => $tableId,
                                'cv_no' => $item->{'Check Voucher No_'},
                                'cv_date' => $item->{'CV Date'} ? Date::parse($item->{'CV Date'}) : null,
                                'cv_status' => $item->{'CV Status'},
                                'collector_name' => $item->{'Collector Name'},
                                'vendor_no' => $item->{'Vendor No_'},
                                'batch_name' => $item->{'Batch Name'},
                                'bal_account_type' => $item->{'Bal_ Account Type'},
                                'bal_account_no' => $item->{'Bal_ Account No_'},
                                'gl_document_no' => $item->{'G_L Document No_'},
                                'remarks' => $item->{'Remarks'},
                                'no_series' => $item->{'No_ Series'},
                                'vendor_name' => $item->{'Vendor Name'},
                                'cv_type' => $item->{'CV Type'},
                                'no_printed' => $item->{'No_ Printed'},
                                'cancelled_by' => $item->{'Cancelled By'},
                                'cancelled_date' => $item->{'Cancelled Date'} ? Date::parse($item->{'Cancelled Date'}) : null,
                                'checked_by' => $item->{'Checked By'},
                                'approved_by' => $item->{'Approved By'},
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];

                            $headerId = DB::table('cv_headers')->insertGetId($header);

                            // Query lines for this header
                            $lines = (clone $lineDb)
                                ->where('CV No_', $item->{'Check Voucher No_'})
                                ->get()
                                ->map(function ($lineItem) use ($headerId) {
                                return [
                                    'cv_header_id' => $headerId,
                                    'line_no' => $lineItem->{'Line No_'},
                                    'crf_no' => $lineItem->{'CRF No_'},
                                    'document_no' => $lineItem->{'Document No_'},
                                    'gl_entry_no' => $lineItem->{'G_L Entry No_'},
                                    'forwarded_amount' => $lineItem->{'Forwarded Amount'},
                                    'paid_amount' => $lineItem->{'Paid Amount'},
                                    'balance' => $lineItem->{'Balance'},
                                    'document_type' => $lineItem->{'Document Type'},
                                    'applies_to_doc_no' => $lineItem->{'Applies To Doc_ No_'},
                                    'invoice_no' => $lineItem->{'Invoice No_'},
                                    'account_name' => $lineItem->{'Account Name'},
                                    'company_dimension_code' => $lineItem->{'Company Dimension Code'},
                                    'department_dimension_code' => $lineItem->{'Department Dimension Code'},
                                    'payment_type' => $lineItem->{'Payment Type'},
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            });

                            $checkPayments = (clone $cpDb)
                                ->where('CV No_', $item->{'Check Voucher No_'})
                                ->get()
                                ->map(function ($checkPayment) use ($headerId) {
                                    return [
                                        'cv_header_id' => $headerId,
                                        'check_number' => $checkPayment->{'Check Number'},
                                        'check_amount' => $checkPayment->{'Check Amount'},
                                        'bank_account_no' => $checkPayment->{'Bank Account No_'},
                                        'bank_name' => $checkPayment->{'Bank Name'},
                                        'check_date' => $checkPayment->{'Check Date'} ? Date::parse($checkPayment->{'Check Date'}) : null,
                                        'clearing_date' => $checkPayment->{'Clearing Date'} ? Date::parse($checkPayment->{'Clearing Date'}) : null,
                                        'cleared_flag' => $checkPayment->{'Cleared Flag'},
                                        'cancelled_flag' => $checkPayment->{'Cancelled Flag'},
                                        'cancelled_date' => $checkPayment->{'Cancelled Date'} ? Date::parse($checkPayment->{'Cancelled Date'}) : null,
                                        'cancelled_by' => $checkPayment->{'Cancelled By'},
                                        'cancellation_reason' => $checkPayment->{'Cancellation Reason'},
                                        'cancelled_with_check_number' => $checkPayment->{'Cancelled with Check Number'},
                                        'check_class' => $checkPayment->{'Check Class'},
                                        'check_class_location' => $checkPayment->{'Check Class Location'},
                                        'created_at' => now(),
                                        'updated_at' => now(),
                                    ];
                                });

                            if ($lines->isNotEmpty()) {
                                DB::table('cv_lines')->insertOrIgnore($lines->toArray());
                            }

                            if ($checkPayments->isNotEmpty()) {
                                DB::table('cv_check_payments')->insertOrIgnore($checkPayments->toArray());
                            }
                            DB::commit();
                        }
                    );
                }, 'Check Voucher No_');
        }

        return $this;
    }
    public function storeLineRecord(?NavLineTable $navLineTable)
    {
        if ($navLineTable) {

            $start = 1;
            $tableName = $navLineTable->name;
            $tableId = $navLineTable->id;

            $query = $this->filterLineRecord($tableName);
            $total = $query->count();

            $query->orderBy('CV No_')
                ->chunkById(500, function ($cv) use (&$start, $total, $tableName, $tableId) {
                    $data = $cv->map(
                        function ($item) use (&$start, $total, $tableName, $tableId) {
                            CvProgress::dispatch("Generating Cv Line " . $tableName . " in progress.. ", $start, $total, $this->userId);
                            $start++;
                            return [
                                'nav_line_table_id' => $tableId,
                                'line_no' => $item->{'Line No_'},
                                'cv_no' => $item->{'CV No_'},
                                'crf_no' => $item->{'CRF No_'},
                                'document_no' => $item->{'Document No_'},
                                'gl_entry_no' => $item->{'G_L Entry No_'},
                                'forwarded_amount' => $item->{'Forwarded Amount'},
                                'paid_amount' => $item->{'Paid Amount'},
                                'balance' => $item->{'Balance'},
                                'document_type' => $item->{'Document Type'},
                                'applies_to_doc_no' => $item->{'Applies To Doc_ No_'},
                                'invoice_no' => $item->{'Invoice No_'},
                                'account_name' => $item->{'Account Name'},
                                'company_dimension_code' => $item->{'Company Dimension Code'},
                                'department_dimension_code' => $item->{'Department Dimension Code'},
                                'payment_type' => $item->{'Payment Type'},
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    )->toArray();

                    DB::transaction(
                        fn() =>
                        DB::table('cv_lines')->insertOrIgnore($data)
                    );
                }, 'CV No_');
        }
        return $this;
    }
    public function storeCheckPaymentRecord(?NavCheckPaymentTable $navCheckPaymentTable)
    {
        if ($navCheckPaymentTable) {

            $start = 1;
            $tableName = $navCheckPaymentTable->name;
            $tableId = $navCheckPaymentTable->id;

            $query = $this->filterCheckPaymentRecord($tableName);
            $total = $query->count();

            $query->orderBy('CV No_')
                ->chunkById(500, function ($cv) use (&$start, $total, $tableName, $tableId) {
                    $data = $cv->map(
                        function ($item) use (&$start, $total, $tableName, $tableId) {

                            CvProgress::dispatch("Generating Cv Check Payment " . $tableName . " in progress.. ", $start, $total, $this->userId);
                            $start++;
                            return [
                                'nav_cp_table_id' => $tableId,
                                'cv_no' => $item->{'CV No_'},
                                'check_number' => $item->{'Check Number'},
                                'check_amount' => $item->{'Check Amount'},
                                'bank_account_no' => $item->{'Bank Account No_'},
                                'bank_name' => $item->{'Bank Name'},
                                'check_date' => $item->{'Check Date'} ? Date::parse($item->{'Check Date'}) : null,
                                'clearing_date' => $item->{'Clearing Date'} ? Date::parse($item->{'Clearing Date'}) : null,
                                'cleared_flag' => $item->{'Cleared Flag'},
                                'cancelled_flag' => $item->{'Cancelled Flag'},
                                'cancelled_date' => $item->{'Cancelled Date'} ? Date::parse($item->{'Cancelled Date'}) : null,
                                'cancelled_by' => $item->{'Cancelled By'},
                                'cancellation_reason' => $item->{'Cancellation Reason'},
                                'cancelled_with_check_number' => $item->{'Cancelled with Check Number'},
                                'check_class' => $item->{'Check Class'},
                                'check_class_location' => $item->{'Check Class Location'},
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    )->toArray();

                    DB::transaction(
                        fn() =>
                        DB::table('cv_check_payments')->insertOrIgnore($data)
                    );
                }, 'CV No_');
        }
    }

    public function setUser(int $user)
    {
        $this->userId = $user;
        return $this;
    }

    public function cvs(?int $page)
    {
        return Inertia::render('retrieveCvCrf', [
            'cv' => CvCheckPayment::paginate($page)
        ]);
    }

    public function details(CvCheckPayment $cv)
    {
        return Inertia::render('dashboard/cv/cvDetails', [
            'cv' => $cv
        ]);
    }

    private function checkDatabase()
    {
        //  $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CV');
        // });
        // dd($tables);

        // dd($servers);
        // $start = "2017-08-05";
        // $end = "2017-09-08";
        // $con = DB::connection('sqlsrvCaf')->table('ALTA CITTA ACCOUNTING$CV Check Payment')
        // ->whereRaw("CONVERT(VARCHAR(10), [Check Date], 120) BETWEEN ? AND ?", [$start, $end])
        // ->limit(10)->get();
        // dd($con);
    }
}
