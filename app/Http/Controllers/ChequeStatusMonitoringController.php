<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Helpers\PaginatorHelper;
use App\Models\ChequeRecord;
use App\Models\ChequeRegister;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChequeStatusMonitoringController extends Controller
{

    public function index(Request $request) // BAHALA NA SI CLAUDE
    {
        $filter = $request->only(['bank']);

        $selectedFilter = $filter['bank'] ?? null;
        $cheques = ChequeRegister::join('bank_accounts', 'bank_accounts.id', 'cheque_registers.bank_account_id')
            ->join('banks', 'bank_accounts.bank_id', 'banks.id')
            ->select('cheque_registers.id', 'banks.acronym as name', 'bank_accounts.account_no', 'cheque_from', 'cheque_to')
            ->when($selectedFilter, function ($q) use ($selectedFilter) {
                $q->where('cheque_registers.bank_account_id', $selectedFilter);
            })
            ->get();

        $acronyms = $cheques->pluck('name')->unique()->values();

        // Strip everything except letters/digits so "129-847-123" == "129847123"
        $normalize = fn($v) => preg_replace('/[^A-Z0-9]/', '', strtoupper((string) $v));

        // 'BPI (129847123)' => ['BPI', '129847123']; account is null if no parentheses
        // 'BPI (129847123)' / 'PNB-305970007946' => [acronym, account digits]
        $parseBank = function (?string $raw) use ($acronyms, $normalize) {
            $raw = strtoupper(trim((string) $raw));
            $match = null;

            foreach ($acronyms as $acronym) {
                $a = strtoupper($acronym);

                if (preg_match('/^' . preg_quote($a, '/') . '(?![A-Z0-9])/', $raw)) {
                    if ($match === null || strlen($a) > strlen($match)) {
                        $match = $a;
                    }
                }
            }

            $account = null;

            if ($match !== null) {
                // Everything after the acronym, with separators/brackets/spaces stripped
                $rest = $normalize(substr($raw, strlen($match)));

                // Treat a run of 6+ digits as the account number
                // (so 'BPI - ICM Branch' stays null instead of becoming a bogus account)
                if (preg_match('/\d{6,}/', $rest, $m)) {
                    $account = $m[0];
                }
            }

            return [$match, $account];
        };

        $records = ChequeRecord::where(function ($q) use ($acronyms) {
            foreach ($acronyms as $acronym) {
                $q->orWhere('bank', 'like', $acronym . '%');
            }
        })
            ->get()
            ->keyBy(function ($r) use ($parseBank) {
                [$bank, $account] = $parseBank($r->bank);

                return $bank . '-' . $account . '-' . trim((string) $r->cheque_number);
            });

        $numbers = [];

        foreach ($cheques as $cheque) {
            $from = trim((string) $cheque->cheque_from);
            $to = trim((string) $cheque->cheque_to);
            $width = max(strlen($from), strlen($to));

            $bank = strtoupper($cheque->name);
            $account = $normalize($cheque->account_no);

            for ($i = (int) $from; $i <= (int) $to; $i++) {
                $number = str_pad((string) $i, $width, '0', STR_PAD_LEFT);

                $lookupKey = $bank . '-' . $account . '-' . $number;
                $record = $records->get($lookupKey);

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

        $data = collect($numbers)->values();


        $items = ChequeRegister::join(
            'bank_accounts',
            'bank_accounts.id',
            '=',
            'cheque_registers.bank_account_id'
        )
            ->join('banks', 'bank_accounts.bank_id', '=', 'banks.id')
            ->select([
                'bank_accounts.id',
                'bank_accounts.account_no',
                'banks.acronym as bank_name',
            ])
            ->distinct()
            ->get()
            ->map(fn($item) => [
                'label' => "{$item->bank_name} - {$item->account_no}",
                'value' => $item->id,
            ])
            ->values();

        return Inertia::render('chequeStatusRange', [
            'data' => PaginatorHelper::paginateCollection($data),
            'items' => $items,
            'bank' => $selectedFilter
        ]);
    }
}
