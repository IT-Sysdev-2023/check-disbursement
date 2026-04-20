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

    public function setMissingCheques(array $missingCheques)
    {
        $this->missingCheques = $missingCheques;
        return $this;
    }

    public function setDateFilter(object $date)
    {
        $this->dateFilter = $date;
        return $this;
    }

    private function generateKey($buName)
    {
        $year = isset($this->dateFilter->year) ? $this->dateFilter->year : '00';
        $month = isset($this->dateFilter->month) ? $this->dateFilter->month : '00';

        return $buName . '-' . $year . '-' . $month;
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
        $duplicates = 1;
        $tableName = $navHeaderTable->name;
        $tableId = $navHeaderTable->id;

        $headerQuery = $this->headerConnection($tableName);
        $lineQuery = $this->lineConnection($navLineTable);
        $checkPaymentQuery = $this->checkPaymentConnection($navCheckPaymentTable);

        $total = $headerQuery->count();

        $key = $this->generateKey($buName);

        if ($total === 0) {
            CvProgress::dispatch($this->userId, "No records found for {$buName}...", ProgressStatus::NoRecord, $tableName);
        }

        $headerQuery->chunkById(500, function ($chunk) use (&$start, &$duplicates, $total, $tableName, $tableId, $lineQuery, $checkPaymentQuery, $buId, $buName, $key) {

            DB::beginTransaction();
            try {

                $now = now();
                $lines = collect();
                $checkPayments = collect();

                $headers = collect();

                $existingCvNo = DB::table('cv_headers')
                    ->where('nav_header_table_id', $tableId)
                    ->whereIn('cv_no', collect($chunk)->pluck('Check Voucher No_'))
                    ->pluck('cv_no')
                    ->flip(); // for faster lookup using isset()

                foreach ($chunk as $item) {

                    $cvNo = $item->{'Check Voucher No_'};
                    if ($existingCvNo->has($cvNo)) {
                        CvProgress::dispatch(
                            $this->userId,
                            "{$cvNo} already exists, skipping ....",
                            ProgressStatus::Duplicate,
                            $tableName,
                            $start,
                            $total,
                            $duplicates,
                            $key
                        );
                        $duplicates++;
                        $start++;

                        continue;
                    }

                    CvProgress::dispatch(
                        $this->userId,
                        "Generating " . $buName . " in progress.. ",
                        ProgressStatus::Processing,
                        $tableName,
                        $start,
                        $total,
                        $duplicates,
                        $key
                    );

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
                $cvNo = $headers->pluck('cv_no');

                $existingCvNos = DB::table('cv_headers')
                    ->where('nav_header_table_id', $tableId)
                    ->whereIn('cv_no', $cvNo)
                    ->pluck('cv_no');

                $newCvNos = $cvNo->diff($existingCvNos);

                $newHeaders = $headers->filter(
                    fn($h) => $newCvNos->contains($h['cv_no'])
                )->values();

                DB::table('cv_headers')->insertOrIgnore($newHeaders->toArray());

                if ($newCvNos->isEmpty()) {
                    DB::commit();
                    return; 
                }

                $headerMap = DB::table('cv_headers')
                    ->where('nav_header_table_id', $tableId)
                    ->whereIn('cv_no', $newCvNos)
                    ->pluck('id', 'cv_no');

                $lines = (clone $lineQuery)
                    ->whereIn('CV No_', $newCvNos)
                    ->get()
                    ->map(fn($line) => [
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

                $checkPayments = (clone $checkPaymentQuery)
                    ->whereIn('CV No_', $newCvNos)
                    ->get()
                    ->map(fn($check) => [
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

    private function showDuplicates($headerMap, $cvNo)
    {
        $insertedCvNos = $headerMap->keys();
        $attemtedCvNos = $cvNo;

        $duplicates = $attemtedCvNos->diff($insertedCvNos);

        if ($duplicates->isNotEmpty()) {
            CvProgress::dispatch(
                $this->userId,
                "Duplicate CV Nos skipped: " . $duplicates->join(', '),
                ProgressStatus::Duplicate
            );

        }
    }
}