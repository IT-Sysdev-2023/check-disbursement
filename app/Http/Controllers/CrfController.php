<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CrfController extends Controller
{
    public function index()
    {
        return Inertia::render('extract/checkRequestForm');
    }

    public function extractCrf(Request $request)
    {
        $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120',
        ]);
        $contents = $request->file('files')[0]->get();

        // Clean invisible characters
        $clean = preg_replace('/[[:^print:]]/', '', $contents);

        // Extract voucher number (e.g., "No. : 11000212")
        preg_match('/No\.\s*:\s*(\d+)/', $clean, $numMatches);
        $voucherNo = $numMatches[1] ?? null;

        // Extract Paid To
        preg_match('/Paid to\s*:\s*([A-Za-z0-9\s&.-]+)/', $clean, $paidToMatches);
        $paidTo = Str::trim($paidToMatches[1]);

        // Extract possible company/office name
        preg_match('/\x0F\x0E([A-Za-z0-9\s&.-]+?)(?=\s+No\.)/', $contents, $officeMatch);
        $office = Str::trim($officeMatch[1]);

        //Extract location
        preg_match('/CHECK VOUCHER\s*-\s*([A-Za-z\s.]+?)(?=\s+Date)/', $clean, $branchMatch);

        // Extract date (e.g., "Date: 11/06/2025" or "Date : 11/06/2025")
        preg_match('/Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/', $clean, $dateMatches);
        $date = $dateMatches[1] ?? null;

        //Particulars
        preg_match('/Particulars\s*:(.*?)(?:[-]{5,}|$)/s', $clean, $blockMatch);
        $particularsBlock = trim($blockMatch[1] ?? '');

        if ($particularsBlock) {
            // Extract the amount
            preg_match('/\*{2,}\s*([\d,]+\.\d{2})\s*\*{2,}/', $particularsBlock, $amountMatch);
            $amount = $amountMatch[1] ?? '';

            // Clean the particulars text
            $particular = preg_replace('/\*{2,}\s*[\d,]+\.\d{2}\s*\*{2,}/', '', $particularsBlock);
            $particular = preg_replace('/\|+/', ' ', $particular);
            $particular = preg_replace('/\s{2,}/', ' ', $particular);
            $particular = preg_replace('/Particulars\s*:/i', '', $particular);
            $particularsText = trim($particular);
        }

        // Extract Bank
        preg_match('/Bank\s*:\s*([A-Za-z0-9\s&.-]+)/', $clean, $bankMatches);
        $bank = Str::trim($bankMatches[1]);

        // Extract Ck #
        preg_match('/Ck\s*#\s*:\s*(\d+)/', $clean, $ckMatches);
        $ck = $ckMatches[1];
        
        // Prepared By #
        preg_match('/Prepared\s*By\s*:\s*([A-Za-z0-9\s&.-]+)/', $clean, $preparedByMatches);
        $preparedBy = Str::trim($preparedByMatches[1]);

        dd($voucherNo, $date, $office, $branchMatch[0], $paidTo, $amount, $particularsText, $bank, $ck, $preparedBy, $contents);
    }
}
