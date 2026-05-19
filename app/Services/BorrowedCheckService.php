<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Resources\BorrowedChequeResource;
use App\Models\Approver;
use App\Models\BorrowedCheque;
use App\Models\Borrower;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BorrowedCheckService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            // 'approver' => 'required|exists:approvers,id',
            // 'borrower' => 'required|exists:borrowers,id',
            'borrower' => 'required|string',
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

        $borrowerNo = (BorrowedCheque::max('borrower_no') ?? 0) + 1;

        $stream = DB::transaction(function () use ($borrowerNo, $validated) {

            BorrowedCheque::insert(
                collect($validated['cheques'])->map(fn($c) => [
                    'borrower_no' => $borrowerNo,
                    'borrower_name' => $validated['borrower'],
                    'reason' => $validated['reason'],
                    'checkable_id' => $c['chequeId'],
                    'checkable_type' => $c['type'],
                    'user_id' => auth()->user()->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->toArray()
            );
            return $this->download($borrowerNo, $validated['reason']);
        });

        return redirect()->back()->with(['status' => true, 'stream' => $stream]);
    }

    public function borrower()
    {
        $transform = Borrower::borrowerSelection();
        $names = Approver::approverSelection();

        return response()->json(['borrower' => $transform, 'approver' => $names]);
    }

    private function download(int $borrowerNo, string $reason)
    {
        $borrower = BorrowedCheque::with('borrower:id,name')
            ->with('checkable')
            ->where('borrower_no', $borrowerNo)
            ->get();
        $companyNames = $borrower->pluck('checkable.getCompany')
            ->filter()
            ->unique()
            ->implode(', ');

        $chequeNumbers = $borrower
            ->map(fn($b) => $b->checkable?->chequeNumber)
            ->filter()
            ->unique();

        $data = [
            'dateBorrowed' => $borrower->first()->created_at->isoFormat('MMMM D, YYYY h:mm A'),
            'company' => $companyNames,
            'borrowerNo' => NumberHelper::padLeft($borrowerNo),
            'noOfChecks' => $borrower->count(),
            'purpose' => $reason,
            'borrowedBy' => Str::upper($borrower->first()->borrower_name),
            'releasedBy' => Str::upper(auth()->user()->name),
            'chequeNumbers' => $chequeNumbers->toArray()
        ];

        return $this->fileHandler
            ->inFolder('pdfs/borrowed/')
            ->createFileName($borrowerNo, auth()->user()->id, '.pdf')
            ->handlePdf($data, 'borrowedPdf');


    }

    public function pendingDetails(BorrowedCheque $id)
    {
        return response()->json(new BorrowedChequeResource($id->load('checkable.tagLocation')));
    }
}