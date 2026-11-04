<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Helpers\PaginatorHelper;
use App\Models\ChequeRecord;
use App\Models\ChequeRegister;
use App\Models\Cv;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChequeStatusMonitoringController extends Controller
{

    public function index(Request $request)
    {
        $selectedFilter = $request->input('bank');

        $cheques = ChequeRegister::select('id', 'bank as name', 'bank_account as account_no', 'cheque_from', 'cheque_to')
            ->when($selectedFilter, function ($q) use ($selectedFilter) {
                $q->where('cheque_registers.id', $selectedFilter);
            })
            ->get();

        // Uppercase, trim and collapse repeated whitespace
        $squish = fn($v) => preg_replace('/\s+/', ' ', strtoupper(trim((string) $v)));

        // Strip everything except letters/digits so "B-002" == "B002"
        $normalize = fn($v) => preg_replace('/[^A-Z0-9]/', '', strtoupper((string) $v));

        // "000123" and "123" are the same cheque number
        $numKey = fn($v) => ltrim(trim((string) $v), '0') ?: '0';

        $banks = $cheques->map(fn($c) => $squish($c->name))->unique()->values();

        // Normalized account numbers per bank
        $accountsByBank = $cheques->groupBy(fn($c) => $squish($c->name))
            ->map(fn($group) => $group->map(fn($c) => $normalize($c->account_no))->all());

        // 'PNB(Ricemill Account)' => ['PNB', 'RICEMILLACCOUNT']
        // 'BPI (129-847-123)'     => ['BPI', '129847123']
        $parseBank = function (?string $raw) use ($banks, $squish, $normalize) {
            $raw = $squish($raw);
            $match = null;

            foreach ($banks as $bank) {
                if (preg_match('/^' . preg_quote($bank, '/') . '(?![A-Z0-9])/', $raw)) {
                    if ($match === null || strlen($bank) > strlen($match)) {
                        $match = $bank;
                    }
                }
            }

            return $match === null
                ? [null, '']
                : [$match, $normalize(substr($raw, strlen($match)))];
        };

        $records = ChequeRecord::where(function ($q) use ($banks) {
            foreach ($banks as $bank) {
                $q->orWhere('bank', 'like', $bank . '%');
            }
        })->get();

        // "BANK-<cheque number>" => [['record' => ..., 'rest' => ...], ...]
        $byBankNumber = [];

        foreach ($records as $r) {
            [$bank, $rest] = $parseBank($r->bank);

            if ($bank !== null) {
                $byBankNumber[$bank . '-' . $numKey($r->cheque_number)][] = [
                    'record' => $r,
                    'rest' => $rest,
                ];
            }
        }

        // How many registers of this bank cover this cheque number
        $covering = fn(string $bank, int $n) => $cheques->filter(
            fn($c) => $squish($c->name) === $bank
                && (int) $c->cheque_from <= $n
                && $n <= (int) $c->cheque_to
        )->count();

        $findRecord = function (string $bank, string $account, int $n) use ($byBankNumber, $numKey, $accountsByBank, $covering) {
            $candidates = $byBankNumber[$bank . '-' . $numKey($n)] ?? [];

            // 1) The record's bank text mentions this register's account number
            if ($account !== '') {
                foreach ($candidates as $c) {
                    if (str_contains($c['rest'], $account)) {
                        return $c['record'];
                    }
                }
            }

            // 2) The record names no account (e.g. "PNB(Ricemill Account)"):
            //    match by bank + cheque number, only if it can't belong to another register
            if ($candidates && $covering($bank, $n) === 1) {
                foreach ($candidates as $c) {
                    $mentionsOther = collect($accountsByBank[$bank] ?? [])
                        ->contains(fn($other) => $other !== '' && str_contains($c['rest'], $other));

                    if (!$mentionsOther) {
                        return $c['record'];
                    }
                }
            }

            return null;
        };

        $numbers = [];

        foreach ($cheques as $cheque) {
            $from = trim((string) $cheque->cheque_from);
            $to = trim((string) $cheque->cheque_to);
            $width = max(strlen($from), strlen($to));

            $bank = $squish($cheque->name);
            $account = $normalize($cheque->account_no);

            for ($i = (int) $from; $i <= (int) $to; $i++) {
                $number = str_pad((string) $i, $width, '0', STR_PAD_LEFT);
                $record = $findRecord($bank, $account, $i);

                // Unique per register so two accounts of the same bank don't overwrite each other
                $rowKey = $cheque->id . '-' . $number;

                $numbers[$rowKey] = [
                    'id' => $rowKey,
                    'bank' => $cheque->name,
                    'account_no' => $cheque->account_no,
                    'cheque_number' => $number,
                    'is_used' => $record !== null,
                    'record' => $record
                        ? tap($record, function ($item) {
                            $item->amount = NumberHelper::currency($item->amount);
                        })
                        : null,
                ];
            }
        }

        $data = collect($numbers)->values()
            ->sortBy([
                ['bank', 'asc'],
                ['account_no', 'asc'],
                ['cheque_number', 'asc'],
            ], SORT_REGULAR)
            ->values();

        $items = ChequeRegister::
            select([
                'id',
                'bank_account as account_no',
                'bank as bank_name',
            ])
            ->distinct()
            ->get()
            ->map(fn($item) => [
                'label' => "{$item->bank_name} - {$item->account_no}",
                'value' => $item->id,
            ])
            ->values();

        return Inertia::render('chequeStatusRange', [
            'data' => PaginatorHelper::paginateCollection($data, 10),
            'items' => $items,
            'bank' => $selectedFilter,
        ]);
    }

    private static function banks()
    {
        return Cv::select('bank')
            ->distinct()
            ->orderBy('bank')
            ->pluck('bank')
            ->filter()
            ->map(fn($bank, $index) => ['value' => $index, 'label' => $bank])
            ->values();
    }

    private static function bankAccounts($bank)
    {
        return Cv::select('bank_account_no')
            ->where('bank', $bank)
            ->distinct()
            ->orderBy('bank_account_no')
            ->pluck('bank_account_no')
            ->filter()
            ->map(fn($bankAccount, $index) => ['value' => $index, 'label' => $bankAccount])
            ->values();
    }
}
