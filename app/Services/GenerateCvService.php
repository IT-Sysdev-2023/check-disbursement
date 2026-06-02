<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CvProgress;
use App\Models\Cv;
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
        ?string $navChequePaymentTable,
        int $buId,
        ?string $buName
    ) {
        if (!$navHeaderTable) {
            return $this;
        }

        $start = 1;
        $duplicates = 0;
        $tableName = $navHeaderTable->name;
        $tableId = $navHeaderTable->id;

        $headerQuery = $this->headerConnection($tableName);
        $checkPaymentQuery = $this->checkPaymentConnection($navChequePaymentTable);

        $total = $headerQuery->count();

        $key = $this->generateKey($buName);

        if ($total === 0) {
            CvProgress::dispatch($this->userId, "No records found for {$buName}...", ProgressStatus::NoRecord, $tableName);
        }

        $headerQuery->chunkById(500, function ($chunk) use (&$start, &$duplicates, $total, $tableName, $tableId, $checkPaymentQuery, $buId, $buName, $key) {

            DB::beginTransaction();
            try {

                $now = now();
                $checkPayments = collect();

                $headers = collect();

                $existingCvNo = Cv::where('nav_header_table_id', $tableId)
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
                        'cv_no' => $item->{'Check Voucher No_'},
                        'cv_date' => optional($item->{'CV Date'}, fn($d) => Date::parse($d)),
                        'remarks' => $item->{'Remarks'},
                    ]);
                }

                $cvNo = $headers->pluck('cv_no');

                $existingCvNos = Cv::where('nav_header_table_id', $tableId)
                    ->whereIn('cv_no', $cvNo)
                    ->pluck('cv_no');

                $newCvNos = $cvNo->diff($existingCvNos);

                $newHeaders = $headers->filter(
                    fn($h) => $newCvNos->contains($h['cv_no'])
                )->values();

                $otherField = (clone $checkPaymentQuery)
                    ->whereIn('CV No_', $newCvNos)
                    ->get()
                    ->keyBy('CV No_');

                $merged = $newHeaders->map(function ($header) use ($otherField, $tableId, $buId, $now) {
                    $payment = $otherField->get($header['cv_no']);

                    return [
                        ...$header,
                        'nav_header_table_id' => $tableId,
                        'business_unit_id' => $buId,
                        'causer_id' => $this->userId,

                        'cheque_number' => $payment?->{'Check Number'},
                        'cheque_amount' => $payment?->{'Check Amount'},
                        'bank_account_no' => $payment?->{'Bank Account No_'},
                        'bank_name' => $payment?->{'Bank Name'},
                        'cheque_date' => optional($payment->{'Check Date'}, fn($d) => Date::parse($d)),
                        'payee' => $payment?->{'Payee'},
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                });

                DB::table('cvs')->insertOrIgnore($merged->toArray());

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