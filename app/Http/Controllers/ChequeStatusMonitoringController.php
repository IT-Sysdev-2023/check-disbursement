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

    public function index(Request $request)
    {
        $perPage = 15;
        $currentPage = request()->integer('page', 1);

        $cheques = ChequeRegister::join('banks', 'cheque_registers.bank_id', 'banks.id')
            ->select('cheque_registers.id', 'banks.acronym as name', 'cheque_from', 'cheque_to')
            ->get();

        $acronyms = $cheques->pluck('name')->unique()->values();

        // Maps 'BPI - ICM Branch' => 'BPI' (null if no known acronym matches)
        $resolveBank = function (?string $raw) use ($acronyms) {
            $raw = strtoupper(trim((string) $raw));
            $match = null;

            foreach ($acronyms as $acronym) {
                $a = strtoupper($acronym);

                // starts with the acronym and is not followed by another letter/digit
                if (preg_match('/^' . preg_quote($a, '/') . '(?![A-Z0-9])/', $raw)) {
                    // prefer the longest acronym if several match
                    if ($match === null || strlen($a) > strlen($match)) {
                        $match = $a;
                    }
                }
            }

            return $match;
        };

        // Only pull records whose bank name starts with one of our acronyms
        $records = ChequeRecord::where(function ($q) use ($acronyms) {
            foreach ($acronyms as $acronym) {
                $q->orWhere('bank', 'like', $acronym . '%');
            }
        })
            ->get()
            ->keyBy(fn($r) => $resolveBank($r->bank) . '-' . trim((string) $r->cheque_number));

        $numbers = [];

        foreach ($cheques as $cheque) {
            $from = trim((string) $cheque->cheque_from);
            $to = trim((string) $cheque->cheque_to);

            // Preserve the number of digits in the range.
            $width = max(strlen($from), strlen($to));

            for ($i = (int) $from; $i <= (int) $to; $i++) {
                $number = str_pad((string) $i, $width, '0', STR_PAD_LEFT);

                $key = strtoupper($cheque->name) . '-' . $number;
                $record = $records->get($key);

                $numbers[$key] = [
                    'id' => $key,
                    'bank' => $cheque->name,
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

        return Inertia::render('chequeStatusRange', ['data' => PaginatorHelper::paginateCollection($data)]);
    }
}
