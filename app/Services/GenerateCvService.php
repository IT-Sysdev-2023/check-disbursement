<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CvProgress;
use App\Models\NavHeaderTable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateCvService extends NavConnection
{

    protected int $userId;

    public function setUser(int $user)
    {
        $this->userId = $user;
        return $this;
    }

    public function setMissingCheques(array $missingCheques){
        $this->missingCheques = $missingCheques;
        return $this;
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
        $key = $buName . '-' . $this->dateFilter->year . '-' . $this->dateFilter->month;

        if ($total === 0) {
            CvProgress::dispatch($this->userId, "No records found for {$buName}...", ProgressStatus::NoRecord, $tableName);
        }

        $headerQuery->chunkById(500, function ($chunk) use (&$start, $total, $tableName, $tableId, $lineQuery, $checkPaymentQuery, $buId, $buName, $key) {

            DB::beginTransaction();
            try {

                $now = now();
                $lines = collect();
                $checkPayments = collect();

                $headers = collect();
                foreach ($chunk as $item) {

                    CvProgress::dispatch($this->userId, "Generating " . $buName . " in progress.. ", ProgressStatus::Processing, $tableName, $start, $total, $key);
                    $start++;

                    $headers->push([
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
                }

                DB::table('cv_headers')->insertOrIgnore($headers->toArray());

                $cvNo = $headers->pluck('cv_no');

                $headerMap = DB::table('cv_headers')
                    ->where('nav_header_table_id', $tableId)
                    ->whereIn('cv_no', $cvNo)
                    ->pluck('id', 'cv_no');

                $linesData = (clone $lineQuery)
                    ->whereIn('CV No_', $cvNo)
                    ->get();

                $cpData = (clone $checkPaymentQuery)
                    ->whereIn('CV No_', $cvNo)
                    ->get();

                $lines = $linesData->map(fn($line) => [
                    'cv_header_id' => $headerMap[$line->{'CV No_'}],
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
                ]);

                $checkPayments = $cpData->map(fn($check) => [
                    'cv_header_id' => $headerMap[$check->{'CV No_'}],
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
                ]);

                if ($lines->isNotEmpty()) {
                    DB::table('cv_lines')->insertOrIgnore($lines->toArray());
                }

                if ($checkPayments->isNotEmpty()) {
                    DB::table('cv_check_payments')->insertOrIgnore($checkPayments->toArray());
                }

                DB::commit();
            } catch (Throwable $e) {
                DB::rollBack();
                Log::error("Failed storing CV Header chunk: " . $e->getMessage());
                throw $e;
            }
        }, 'Check Voucher No_');

        return $this;
    }
}