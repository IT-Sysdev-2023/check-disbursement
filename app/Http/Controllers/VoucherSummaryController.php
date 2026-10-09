<?php

namespace App\Http\Controllers;

use App\Http\Resources\BorrowedChequeResource;
use App\Models\BorrowedCheque;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Http\Request;
use Illuminate\Contracts\Database\Query\Builder;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoucherSummaryController extends Controller
{
    public function index(Request $request)
    {

        $cheques = BorrowedCheque::query()
            ->with('checkable.chequeStatus.chequeForwardedStatus')
            ->where(function (Builder $q) {
                $q->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    fn(Builder $q) => $q->has('chequeStatus')
                );
            })
            ->paginate(10)
            ->withQueryString();

        $chequeNumbers = $cheques->getCollection()
            ->pluck('checkable.cheque_number')
            ->filter()
            ->unique()
            ->values();

        $existingNumbers = DB::connection('brs')
            ->table('dtrs')
            ->whereIn('cheque_no', $chequeNumbers)
            ->pluck('cheque_no')
            ->map(fn($number) => (string) $number)
            ->flip();

        $cheques->getCollection()->transform(function ($cheque) use ($existingNumbers) {
            $number = (string) $cheque->checkable->cheque_number;

            $cheque->setAttribute(
                'exists_on_remote_server',
                $existingNumbers->has($number)
            );

            return $cheque;
        });



        return Inertia::render('voucherSummary', [
            'cheques' => BorrowedChequeResource::collection($cheques),
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);
    }
}
