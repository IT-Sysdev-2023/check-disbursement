<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Requests\BorrowedCheckRequest;
use App\Models\BorrowedCheck;
use App\Models\Borrower;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;

class BorrowedCheckService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }
    public function borrowedChecks(Request $request)
    {

        $ids = BorrowedCheck::where('borrower_no', $request->borrowerNo)->pluck('checkable_id');

        if ($request->check === 'cv') {
            $records = CvCheckPayment::with('cvHeader', 'company')
                ->select('check_date', 'check_amount', 'cv_check_payments.id', 'cv_header_id', 'companies.name as company_name', 'payee')
                ->join('companies', 'companies.id', '=', 'cv_check_payments.company_id')
                ->whereIn('cv_check_payments.id', $ids)
                ->get()
                ->each(function ($item) {
                    $item->date = $item->check_date->toFormattedDateString();
                    $item->check_amount = NumberHelper::currency($item->check_amount);
                });
        } else {
            $records = Crf::select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by')
                ->whereIn('id', $ids)
                ->get()
                ->append('formatted_amount');
        }
        return response()->json($records);

    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|exists:borrowers,id',
            'reason' => 'required|string|max:255',
            'cheques' => 'required|array',
        ]);


        foreach ($validated['cheques'] as $cheque) {
            $model = Relation::getMorphedModel($cheque['type']);

            $hasNoLocation = $model::whereKey($cheque['chequeId'])
                ->whereNull('tag_location_id')
                ->exists();

            if ($hasNoLocation) {
                return redirect()->back()->with([
                    'status' => false,
                    'message' => 'Some selected checks have no location assigned. Please assign location before borrowing.',
                ]);
            }
        }

        $borrowerNo = (BorrowedCheck::max('borrower_no') ?? 0) + 1;

        BorrowedCheck::insert(
            collect($validated['cheques'])->map(fn($c) => [
                'checkable_id' => $c['chequeId'],
                'checkable_type' => $c['type'],
                'borrower_no' => $borrowerNo,
                'borrower_id' => $validated['name'],
                'reason' => $validated['reason'],
                'user_id' => auth()->user()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray()
        );

        return $this->download($borrowerNo);
    }

    public function borrower()
    {
        $transform = Borrower::borrowerSelection();

        return response()->json($transform);
    }

    private function download(int $borrowerNo)
    {
        $borrower = BorrowedCheck::with('borrower:id,name')
            ->with('checkable')
            ->where('borrower_no', $borrowerNo)
            ->get();

        $companyNames = $borrower->pluck('checkable.getCompany')
            ->filter()
            ->unique()
            ->implode(', ');

        $data = [
            'dateBorrowed' => $borrower->first()->created_at->isoFormat('MMMM D, YYYY h:mm A'),
            'items' => [
                [
                    'borrowerNo' => NumberHelper::padLeft($borrowerNo),
                    'noOfChecks' => $borrower->count(),
                    'borrowedBy' => $borrower->first()->borrower?->name,
                    'company' => $companyNames,
                    'purpose' => 'For Signature',
                ]
            ]
        ];

        $stream = $this->fileHandler
            ->inFolder('pdfs/borrowed/')
            ->createFileName($borrowerNo, auth()->user()->id, '.pdf')
            ->handlePdf($data, 'borrowedPdf');

        return redirect()->back()->with(['status' => true, 'stream' => $stream]);
    }
}