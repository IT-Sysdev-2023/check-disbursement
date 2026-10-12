<?php

namespace App\Exports;


use App\Models\BorrowedCheque;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ForwardedExport implements FromQuery, WithTitle, WithHeadings, ShouldAutoSize
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected string $location;
    protected array $columns;
    public function __construct(string $location)
    {
        $this->location = $location;
        $this->columns = [
            'borrower_name',
            'supplier',
            'cheque_no',
            'payee',
            'cheque_date',
            'amount',
            'amount_in_words',
            'bank_account_name',
            'bank_address',
            'account_number',
            'account_name'
        ];
    }

    public function title(): string
    {
        return "$this->location Record";
    }

    public function headings(): array
    {
        return $this->columns;
    }

    public function query()
    {
        $loc = [
            'cebu' => 1,
            'manila' => 2
        ];

        return BorrowedCheque::select(
            $this->columns
        )
            ->whereNot('approver_id', null)
            ->join('scanned_records', 'borrowed_cheques.id', 'scanned_records.borrowed_cheque_id')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $loc[$this->location])) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            );
    }
}
