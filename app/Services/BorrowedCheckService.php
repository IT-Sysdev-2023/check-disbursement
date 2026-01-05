<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Requests\BorrowedCheckRequest;
use App\Models\BorrowedCheck;
use App\Models\BorrowerName;
use App\Models\Crf;
use App\Models\CvCheckPayment;
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
    
    public function store(BorrowedCheckRequest $request)
    {
        $validated = $request->validated();

        if (!self::checkIds($validated['check'], $validated['ids'])) {
            return redirect()->back()->with(['status' => false, 'message' => 'Some selected checks have no location assigned. Please assign location before borrowing.']);
        }

        $borrowerNo = (BorrowedCheck::max('borrower_no') ?? 0) + 1;
        if ($validated['type'] === 'exclude') {
            if ($validated['check'] === 'cv') {
                CvCheckPayment::doesntHave('borrowedCheck')
                    ->doesntHave('checkStatus')
                    ->where(function ($q) {
                        $q->where('check_number', '!=', 0)
                            ->orHas('assignedCheckNumber');
                    })
                    ->whereNotIn('id', $validated['ids'])
                    ->chunk(100, function (Collection $items) use ($validated, $borrowerNo) {

                        $data = $items->map(fn($check) => [
                            'checkable_id' => $check->id,
                            'checkable_type' => $validated['check'],
                            'borrower_no' => $borrowerNo,
                            'borrower_name_id' => $validated['name'],
                            'reason' => $validated['reason'],
                            'user_id' => auth()->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            } else {
                Crf::doesntHave('checkStatus')
                    ->doesntHave('borrowedCheck')
                    ->whereNotIn('id', $validated['ids'])
                    ->chunk(100, function (Collection $items) use ($validated, $borrowerNo) {

                        $data = $items->map(fn($check) => [
                            'checkable_id' => $check->id,
                            'checkable_type' => $validated['check'],
                            'borrower_no' => $borrowerNo,
                            'borrower_name_id' => $validated['name'],
                            'reason' => $validated['reason'],
                            'user_id' => auth()->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            }
        } else {
            foreach ($validated['ids'] as $id) {
                auth()->user()->borrowedChecks()->create([
                    'checkable_id' => $id,
                    'checkable_type' => $validated['check'],
                    'borrower_no' => $borrowerNo,
                    'borrower_name_id' => $validated['name'],
                    'reason' => $validated['reason'],
                ]);
            }
        }

        return $this->download($borrowerNo, $request->check);
    }

    public function borrowerNames()
    {
        $names = BorrowerName::select('id', 'name')->get();

        $transform = $names->map(function ($name) {
            return [
                'label' => $name->name,
                'value' => $name->id,
            ];
        });

        return response()->json($transform);
    }

    private function download(int $borrowerNo, string $check)
    {
        $borrower = BorrowedCheck::with('borrowerName:id,name')
            ->with($check === 'cv' ? 'cvCheckPayment.company' : 'crf')
            ->where('borrower_no', $borrowerNo)
            ->get();

        $companyNames = $borrower
            ->pluck($check === 'cv' ? 'cvCheckPayment.company.name' : 'crf.company')
            ->filter()
            ->unique()
            ->implode(', ');

        $data = [
            'dateBorrowed' => $borrower->first()->created_at->isoFormat('MMMM D, YYYY h:mm A'),
            'items' => [
                [
                    'borrowerNo' => NumberHelper::padLeft($borrowerNo),
                    'noOfChecks' => $borrower->count(),
                    'borrowedBy' => $borrower->first()->borrowerName?->name,
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
    private function checkIds($check, $ids)
    {
        $model = $check === 'cv' ? CvCheckPayment::class : Crf::class;

        return $model::whereIn('id', $ids)
            ->whereNull('tag_location_id')
            ->count() === 0;
    }
}