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
    public function retrieveData(User $user, object $date, array $bu)
    {
        // Get all the Navition Servers
        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) use ($bu) {
                $query->whereIn('company', $bu)
                    ->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();
        $id = $user->id;

        $nav->each(function (NavServer $server) use ($id, $date) {
            $databases = $server->navDatabases; // dont Change this cause it will re-hydrates inside the job(no Filtering on Records will happen)
            CvServer::dispatch($server->id, $id, $date, $databases);
        });

    }

    public function setDateFilter(object $date)
    {
        $this->dateFilter = $date;
        return $this;
    }

    public function storeRecord(
        ?NavHeaderTable $navHeaderTable,
        ?string $navLineTable,
        ?string $navCheckPaymentTable
    ) {
        if (!$navHeaderTable) {
            return $this;
        }

        $start = 1;
        $tableName = $navHeaderTable->name;
        $tableId = $navHeaderTable->id;

        $headerQuery = $this->headerConnection($tableName);
        $lineQuery = $this->lineConnection($navLineTable);
        $checkPaymentQuery = $this->checkPaymentConnection($navCheckPaymentTable);

        $total = $headerQuery->count();

        $headerQuery->chunkById(500, function ($chunk) use (&$start, $total, $tableName, $tableId, $lineQuery, $checkPaymentQuery) {

            DB::beginTransaction();
            try {
                $now = now();

                $lines = collect();
                $checkPayments = collect();

                foreach ($chunk as $item) {

                    CvProgress::dispatch("Generating Cv Header " . $tableName . " in progress.. ", $start, $total, $this->userId);
                    $start++;

                    $headerId = DB::table('cv_headers')->insertGetId([
                        'nav_header_table_id' => $tableId,
                        'cv_no' => $item->{'Check Voucher No_'},
                        'cv_date' => optional($item->{'CV Date'}, fn($d) => Date::parse($d)),
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
                        'cancelled_date' => optional($item->{'Cancelled Date'}, fn($d) => Date::parse($d)),
                        'checked_by' => $item->{'Checked By'},
                        'approved_by' => $item->{'Approved By'},
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);

                    // Collect CV Lines
                    $lines = $lines->merge(
                        (clone $lineQuery)->where('CV No_', $item->{'Check Voucher No_'})
                            ->get()
                            ->map(fn($line) => [
                                'cv_header_id' => $headerId,
                                'line_no' => $line->{'Line No_'},
                                'crf_no' => $line->{'CRF No_'},
                                'document_no' => $line->{'Document No_'},
                                'gl_entry_no' => $line->{'G_L Entry No_'},
                                'forwarded_amount' => $line->{'Forwarded Amount'},
                                'paid_amount' => $line->{'Paid Amount'},
                                'balance' => $line->{'Balance'},
                                'document_type' => $line->{'Document Type'},
                                'applies_to_doc_no' => $line->{'Applies To Doc_ No_'},
                                'invoice_no' => $line->{'Invoice No_'},
                                'account_name' => $line->{'Account Name'},
                                'company_dimension_code' => $line->{'Company Dimension Code'},
                                'department_dimension_code' => $line->{'Department Dimension Code'},
                                'payment_type' => $line->{'Payment Type'},
                                'created_at' => $now,
                                'updated_at' => $now,
                            ])
                    );

                    // Collect Check Payments
                    $checkPayments = $checkPayments->merge(
                        (clone $checkPaymentQuery)->where('CV No_', $item->{'Check Voucher No_'})
                            ->get()
                            ->map(fn($check) => [
                                'cv_header_id' => $headerId,
                                'check_number' => $check->{'Check Number'},
                                'check_amount' => $check->{'Check Amount'},
                                'bank_account_no' => $check->{'Bank Account No_'},
                                'bank_name' => $check->{'Bank Name'},
                                'check_date' => optional($check->{'Check Date'}, fn($d) => Date::parse($d)),
                                'clearing_date' => optional($check->{'Clearing Date'}, fn($d) => Date::parse($d)),
                                'cleared_flag' => $check->{'Cleared Flag'},
                                'cancelled_flag' => $check->{'Cancelled Flag'},
                                'cancelled_date' => optional($check->{'Cancelled Date'}, fn($d) => Date::parse($d)),
                                'cancelled_by' => $check->{'Cancelled By'},
                                'cancellation_reason' => $check->{'Cancellation Reason'},
                                'cancelled_with_check_number' => $check->{'Cancelled with Check Number'},
                                'check_class' => $check->{'Check Class'},
                                'check_class_location' => $check->{'Check Class Location'},
                                'payee' => $check->{'Payee'},
                                'created_at' => $now,
                                'updated_at' => $now,
                            ])
                    );
                }

                if ($lines->isNotEmpty()) {
                    DB::table('cv_lines')->insertOrIgnore($lines->toArray());
                }

                if ($checkPayments->isNotEmpty()) {
                    DB::table('cv_check_payments')->insertOrIgnore($checkPayments->toArray());
                }

                DB::commit();
            } catch (\Throwable $e) {
                DB::rollBack();
                Log::error("Failed storing CV Header chunk: " . $e->getMessage());
                throw $e;
            }
        }, 'Check Voucher No_');

        return $this;
    }

    public function setUser(int $user)
    {
        $this->userId = $user;
        return $this;
    }

    public function cvs(?int $page)
    {
        // dd(2);
        return Inertia::render('retrievedCv', [
            'cv' => CvCheckPayment::with('cvHeader')->paginate($page)
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
