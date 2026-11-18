<?php

namespace App\Services;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Resources\BorrowedChequeResource;
use App\Models\Approver;
use App\Models\BorrowedCheque;
use App\Models\BorrowedChequesPdf;
use App\Models\Borrower;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Str;

class BorrowedCheckService
{
    public function __construct(protected FileHandler $fileHandler)
    {
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'approver' => 'required|exists:approvers,id',
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

        $path = DB::transaction(function () use ($borrowerNo, $validated) {

            $models = collect($validated['cheques'])
                ->map(fn($c) => BorrowedCheque::create([
                    'borrower_no' => $borrowerNo,
                    'approver_id' => $validated['approver'],
                    'borrower_name' => $validated['borrower'],
                    'reason' => $validated['reason'],
                    'checkable_id' => $c['chequeId'],
                    'checkable_type' => $c['type'],
                    'is_ds' => $c['location'] === 'Deposit',
                    'user_id' => auth()->id(),
                ]));

            $borrowedCheques = new EloquentCollection($models->all());

            return $this->download($borrowedCheques, $validated['reason']);
        });

        return redirect()->back()->with(['status' => true, 'stream' => route('pdf.view', ['path' => $path])]);
    }

    public function borrower()
    {
        $transform = Borrower::borrowerSelection();
        $names = Approver::approverSelection();

        return response()->json(['borrower' => $transform, 'approver' => $names]);
    }
    public function approvers()
    {
        $names = Approver::approverSelection();

        return response()->json($names);
    }

    private function download(Collection $borrowedCheques, string $reason)
    {
        $borrowed = $borrowedCheques->load([
            'checkable.tagLocation',
        ]);

        $companyNames = $borrowed
            ->map(fn($cheque) => $cheque->checkable?->getCompany)
            ->filter()
            ->unique()
            ->implode(', ');

        $cheques = $borrowed
            ->map(fn($b) => $b->checkable)
            ->filter()
            ->unique();

        $details = $borrowed->first();
        $data = [
            'dateBorrowed' => $details->created_at->isoFormat('MMMM D, YYYY h:mm A'),
            'company' => $companyNames,
            'borrowerNo' => NumberHelper::padLeft($details->borrower_no),
            'noOfChecks' => $borrowed->count(),
            'purpose' => $reason,
            'borrowedBy' => Str::upper($details->borrower_name),
            'releasedBy' => Str::upper(auth()->user()->name),
            'cheques' => $cheques->toArray()
        ];

        $filepath = $this->fileHandler
            ->inFolder('pdfs/borrowed/')
            ->createFileName($details->borrower_no, auth()->user()->id, '.pdf')
            ->handlePdf($data, 'borrowedPdf');

        BorrowedChequesPdf::create([
            'borrower_no' => $details->borrower_no,
            'file_path' => $filepath
        ]);

        return $filepath;
    }

    public function pendingDetails(BorrowedCheque $id)
    {
        return response()->json(new BorrowedChequeResource($id->load('checkable.tagLocation')));
    }
}