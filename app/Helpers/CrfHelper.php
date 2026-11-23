<?php

namespace App\Helpers;
use App\Models\BusinessUnit;
use App\Models\Company;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Number;
use Illuminate\Support\Str;
class CrfHelper
{

    private $fileContents;
    private string $filename;
    private ?int $no;
    private string $paidTo;
    private string $company;
    private ?string $location;
    private ?Carbon $crfDate;
    private ?Carbon $chequeDate;
    private ?float $amount;
    private ?string $particular;
    private ?string $crfNo;
    private string $bank;
    private ?int $ckNo;
    private string $preparedBy;
    private array $slCodes = [];
    public function __construct($file)
    {
        // Clean invisible characters
        $this->fileContents = preg_replace('/[[:^print:]]/', '', $file);
    }

    public function setFilename($file)
    {
        $this->filename = $file;
        return $this;
    }
    public function extractCompany()
    {
        // Extract possible company/office name
        preg_match('/x0\s*([A-Za-z0-9\s&.-]+?)(?=\s+No\.)/', $this->fileContents, $officeMatch);

        // Company not found — tell the caller to skip this file
        if (empty($officeMatch[1])) {
            return false;
        }

        $this->company = Str::trim($officeMatch[1]);

        return true;
    }
    public function extractNo()
    {
        // Extract number (e.g., "No. : 11000212")
        preg_match('/No\.\s*:\s*(\d+)/', $this->fileContents, $numMatches);

        $this->no = $numMatches[1];

        return $this;
    }

    public function extractLocation()
    {
        //Extract location
        preg_match('/CHECK VOUCHER\s*-\s*([A-Za-z\s.]+?)(?=\s+Date)/', $this->fileContents, $branchMatch);
        $this->location = $branchMatch[0];

        return $this;
    }

    public function extractCrfDate()
    {
        // Extract date (e.g., "Date: 11/06/2025" or "Date : 11/06/2025")
        preg_match('/Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/', $this->fileContents, $dateMatches);
        $this->crfDate = Date::parse($dateMatches[1]);

        return $this;
    }

    public function extractPaidTo()
    {
        // Extract Paid To
        preg_match('/Paid to\s*:\s*([A-Za-z0-9\s&.-]+)/', $this->fileContents, $paidToMatches);
        $this->paidTo = Str::trim($paidToMatches[1]);

        return $this;
    }
    public function extractParticularsAndAmount()
    {
        //Particulars
        preg_match('/Particulars\s*:(.*?)(?:[-]{5,}|$)/s', $this->fileContents, $blockMatch);
        if (!isset($blockMatch[1])) {
            return null;
        }

        $particularsBlock = Str::trim($blockMatch[1]);

        if (!$particularsBlock) {
            return null;
        }

        // Extract the amount
        preg_match(
            '/\*+([\d,]+\.\d{2})\*+/',
            $particularsBlock,
            $amountMatch
        );

        if (!isset($amountMatch[1])) {
            return null;
        }

        $amount = $amountMatch[1];

        // Clean the particulars text
        $particular = preg_replace('/\*{2,}\s*[\d,]+\.\d{2}\s*\*{2,}/', '', $particularsBlock);
        $particular = preg_replace('/\|+/', ' ', $particular);
        $particular = preg_replace('/\s{2,}/', ' ', $particular);

        $particularsText = Str::trim($particular);

        $this->amount = Number::parseFloat($amount);
        $this->particular = $particularsText;

        return $this;
    }

    public function extractCrf()
    {
        //Extract CRF# in Particular
        preg_match('/CRF#?(\d+)/', $this->particular, $match);

        $this->crfNo = $match[0];
        return $this;
    }

    public function extractBank()
    {
        // Extract Bank
        preg_match('/Bank\s*:\s*([A-Za-z0-9\s&.-]+)/', $this->fileContents, $bankMatches);
        $this->bank = Str::trim($bankMatches[1]);

        return $this;
    }

    public function extractSlCodes()
    {
        $contents = $this->fileContents;

        // Handle UTF-16 files, BOM and non-breaking spaces
        if (str_starts_with($contents, "\xFF\xFE") || str_starts_with($contents, "\xFE\xFF")) {
            $contents = mb_convert_encoding($contents, 'UTF-8', 'UTF-16');
        }
        $contents = str_replace(["\xEF\xBB\xBF", "\xC2\xA0"], ['', ' '], $contents);

        // account code, then spaces/pipes, then an S/L code like BU-POOL
        preg_match_all(
            '/\b\d+(?:\.\d+)+\/\d+[\s|¦│]+([A-Z]{2,}-[A-Z0-9]+)/u',
            $contents,
            $m
        );

        $this->slCodes = array_values(array_unique($m[1]));

        return $this;
    }

    public function extractCkNo()
    {
        // Extract Ck # and Check Date
        preg_match(
            '/Ck\s*#\s*:\s*(\d+)\s*\/\s*(?:(\d{2}\/\d{2}\/\d{4}))?/',
            $this->fileContents,
            $matches
        );

        $this->ckNo = isset($matches[1])
            ? Number::parseInt($matches[1])
            : null;

        $this->chequeDate = isset($matches[2])
            ? Date::parse($matches[2])
            : null;

        return $this;
    }

    public function extractPreparedBy()
    {
        // Prepared By #
        preg_match('/Prepared\s*By\s*:\s*([A-Za-z0-9\s&.-]+)/', $this->fileContents, $preparedByMatches);
        $this->preparedBy = Str::trim($preparedByMatches[1]);

        return $this;
    }

    public function getRecords(int $userId)
    {

        $buIds = BusinessUnit::whereIn('code', $this->slCodes)
            ->pluck('id');

        $buId = $buIds->count() === 1 ? $buIds->first() : 91; // 91 = HO

        return [
            'causer_id' => $userId,
            'filename' => $this->filename,
            'crf_no' => $this->crfNo,
            'crf_date' => $this->crfDate,
            'business_unit_id' => $buId,
            'company_office' => $this->company,
            'no' => $this->no,
            'crf_location' => $this->location,
            'cheque_date' => $this->chequeDate,
            'bank' => $this->bank,
            'cheque_number' => $this->ckNo,
            'prepared_by' => $this->preparedBy,
            'payee' => $this->paidTo,
            'cheque_amount' => $this->amount,
            'particulars' => $this->particular,
            'sl_code' => json_encode($this->slCodes),
            'created_at' => now(),
            'updated_at' => now()

        ];
    }

    public static function checkProperties(Collection $records, ?array $bu = [])
    {
        return $records->every(function ($item) use ($bu) {
            return (!empty($item['company_office']) && !empty($item['no'])
                && !empty($item['crf_location'])
                // && !empty($item['cheque_date'])
                && !empty($item['bank']) && !empty($item['cheque_number'])
                // && !empty($item['prepared_by']) 
                && !empty($item['payee'])
                && !empty($item['cheque_amount']) && !empty($item['particulars']))
                // &&
                // (Str::contains($item['company_office'], $bu, ignoreCase: true))
            ; // disable case sensitivity
        });
    }

    public static function normalizeDocNo(?string $no): string
    {
        $no = strtoupper(trim(str_replace('#', '', (string) $no)));

        // CRF0004069 -> CRF4069
        return preg_replace('/^([A-Z]*)0+(?=\d)/', '$1', $no);
    }
}