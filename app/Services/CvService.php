<?php

namespace App\Services;

use App\Events\CvProgress;
use App\Http\Resources\CvCheckPaymentResource;
use App\Jobs\CvDatabase;
use App\Jobs\CvServer;
use App\Models\BusinessUnit;
use App\Models\Company;
use App\Models\CvCheckPayment;
use App\Models\NavHeaderTable;
use App\Models\NavServer;
use App\Models\User;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Inertia\Inertia;
class CvService extends NavConnection
{
    /**
     * Create a new class instance.
     */

    protected int $userId;

    public function __construct()
    {
    }
    public function index(User $user)
    {
        $bu = PermissionService::getCompanyPermissions($user);
        return Inertia::render('extract/checkVoucher', [
            'bu' => $bu
        ]);
    }
    public function retrieveData(Request $request)
    {

        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'company' => ['required', 'array', 'min:1'],
            'bu' => ['required', 'array', 'min:1'],
        ]);
        $date = (object) [
            'start' => $request->start_date,
            'end' => $request->end_date
        ];

        $user = $request->user();

        // Get all the Navition Servers
        $buId = BusinessUnit::whereIn('name', $request->bu)->pluck('id', 'name')->values();

        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function (Builder $query) use ($buId) {
                $query->whereIn('business_unit_id', $buId)
                    ->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();

        $id = $user->id;

        $nav->each(function (NavServer $server) use ($id, $date) {

            $jobs = [];
            foreach ($server->navDatabases as $db) {
                $jobs[] = new CvDatabase($server->id, $id, $date, $db->id);
            }

            Bus::batch($jobs)
                ->name("CV Import Server {$server->id}")
                ->then(function () use ($id) {
                    CvProgress::dispatch("Data Retrieval Completed", '', 0, 0, $id, false, true);
                })
                ->dispatch();
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
        ?string $navCheckPaymentTable,
        int $buId,
        ?string $buName
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

        if ($total === 0) {
            CvProgress::dispatch("No records found for {$buName}...", $tableName, 0, 0, $this->userId, true);
        }

        $headerQuery->chunkById(500, function ($chunk) use (&$start, $total, $tableName, $tableId, $lineQuery, $checkPaymentQuery, $buId, $buName) {

            DB::beginTransaction();
            try {
                $now = now();

                $lines = collect();
                $checkPayments = collect();

                foreach ($chunk as $item) {

                    CvProgress::dispatch("Generating Cv Header " . $buName . " in progress.. ", $tableName, $start, $total, $this->userId);
                    $start++;

                    // Collect CV Lines
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
                                'causer_id' => $this->userId,
                                'business_unit_id' => $buId,
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

    public function details(CvCheckPayment $cv)
    {
        return Inertia::render('retrievedRecords/checkDetailsCv', [
            'cv' => new CvCheckPaymentResource($cv->load('cvHeader:id,cv_no,vendor_no,remarks', 'checkStatus'))
        ]);
    }

    public function signatureDetails(CvCheckPayment $cv)
    {
        return Inertia::render('retrievedRecords/checkDetailsCvSignature', [
            'cv' => new CvCheckPaymentResource($cv->load('cvHeader:id,cv_no,vendor_no,remarks', 'checkStatus'))
        ]);
    }

    public function businessUnits(Request $request)
    {
        $bu = BusinessUnit::query()
            ->whereHas(
                'company',
                fn($q) =>
                $q->whereIn('name', $request->companies)
            )
            ->pluck('name', 'id')
            ->map(fn($label, $value) => compact('label', 'value'))
            ->values();
        return response()->json($bu);
    }
}
