<?php

namespace App\Helpers;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
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
    private ?Carbon $date;
    private ?float $amount;
    private ?string $particular;
    private string $bank;
    private ?int $ckNo;
    private string $preparedBy;
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

        $this->company = Str::trim($officeMatch[1]);

        return $this;
    }
    public function extractNo()
    {
        // Extract number (e.g., "No. : 11000212")
        preg_match('/No\.\s*:\s*(\d+)/', $this->fileContents, $numMatches);
        // dd(optional($numMatches[1]));
        $this->no = Number::parseInt($numMatches[1]);

        return $this;
    }

    public function extractLocation()
    {
        //Extract location
        preg_match('/CHECK VOUCHER\s*-\s*([A-Za-z\s.]+?)(?=\s+Date)/', $this->fileContents, $branchMatch);
        $this->location = $branchMatch[0];

        return $this;
    }

    public function extractDate()
    {
        // Extract date (e.g., "Date: 11/06/2025" or "Date : 11/06/2025")
        preg_match('/Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/', $this->fileContents, $dateMatches);
        $this->date = Date::parse($dateMatches[1]);

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
        $particularsBlock = Str::trim($blockMatch[1]);

        if ($particularsBlock) {
            // Extract the amount
            preg_match('/\*{2,}\s*([\d,]+\.\d{2})\s*\*{2,}/', $particularsBlock, $amountMatch);
            $amount = $amountMatch[1];

            // Clean the particulars text
            $particular = preg_replace('/\*{2,}\s*[\d,]+\.\d{2}\s*\*{2,}/', '', $particularsBlock);
            $particular = preg_replace('/\|+/', ' ', $particular);
            $particular = preg_replace('/\s{2,}/', ' ', $particular);
            $particular = preg_replace('/Particulars\s*:/i', '', $particular);
            $particularsText = Str::trim($particular);
        }

        $this->amount = Number::parseFloat($amount);
        $this->particular = $particularsText;

        return $this;
    }

    public function extractBank()
    {
        // Extract Bank
        preg_match('/Bank\s*:\s*([A-Za-z0-9\s&.-]+)/', $this->fileContents, $bankMatches);
        $this->bank = Str::trim($bankMatches[1]);

        return $this;
    }

    public function extractCkNo()
    {
        // Extract Ck #
        preg_match('/Ck\s*#\s*:\s*(\d+)/', $this->fileContents, $ckMatches);
        $this->ckNo = Number::parseInt($ckMatches[1]);

        return $this;
    }

    public function extractPreparedBy()
    {
        // Prepared By #
        preg_match('/Prepared\s*By\s*:\s*([A-Za-z0-9\s&.-]+)/', $this->fileContents, $preparedByMatches);
        $this->preparedBy = Str::trim($preparedByMatches[1]);

        return $this;
    }

    public function getRecords()
    {
        return [
            'filename' => $this->filename,
            'company' => $this->company,
            'no' => $this->no,
            'location' => $this->location,
            'date' => $this->date,
            'bank' => $this->bank,
            'ck_no' => $this->ckNo,
            'prepared_by' => $this->preparedBy,
            'paid_to' => $this->paidTo,
            'amount' => $this->amount,
            'particulars' => $this->particular,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public static function checkProperties(Collection $record)
    {
        return $record->every(function ($item) {
            return !empty($item['company']) && !empty($item['no'])
                && !empty($item['location']) && !empty($item['date'])
                && !empty($item['bank']) && !empty($item['ck_no'])
                && !empty($item['prepared_by']) && !empty($item['paid_to'])
                && !empty($item['amount']) && !empty($item['particulars']);
        });
    }


}