<?php

namespace App\Services;

use App\Http\Resources\BorrowedCheckResource;
use App\Http\Resources\BorrowedChequeResource;
use App\Models\Approver;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\DepositSlip;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ChequeRequestService
{
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);
        $borrowedRecords = self::borrowedRecords($filters);

        return Inertia::render('checkReceiving', [
            'cheques' => $borrowedRecords,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }

    public function borrowedChecks(Request $request)
    {
        $records = BorrowedCheque::with('checkable')
            ->where([['borrower_no', $request->borrowerNo], ['approved_at', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->get();

        return response()->json(BorrowedChequeResource::collection($records));
    }

    public function approveCheck(Request $request)
    {
        $validated = $request->validate([
            'borrowedIds' => [
                'array',
                'min:1',
            ],
            'borrowerNo' => ['required', 'integer']
        ]);
        $ids = $validated['borrowedIds'] ?? [];

        $query = BorrowedCheque::where('borrower_no', $validated['borrowerNo'])->whereIn('id', $ids)->update([
            'approved_at' => now(),
        ]);

        $message = $query
            ? 'Successfully Approved'
            : 'Failed to Approve';

        return redirect()
            ->route('cheque-requests')
            ->with([
                'status' => true,
                'message' => $message,
            ]);
    }

    public function approver()
    {
        $names = Approver::approverSelection();

        return response()->json($names);
    }

    public function borrowedNumberCheques(int $id)
    {
        $record = BorrowedCheque::with('checkable.tagLocation')
            ->notDs()
            ->where([['borrower_no', $id], ['approved_at', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn(Builder $query) => $query->has('chequeStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        $selection = Approver::approverSelection();
        return Inertia::render('chequeRequests/borrowedCheques', [
            'cheques' => $record,
            'approvers' => $selection,
            'borrowerId' => $id,
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

    public function cancelCheck(Request $request)
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
            'ids' => [
                'array',
                'min:1',
            ],
            'borrowerNo' => ['required', 'integer']
        ]);
        $ids = $validated['ids'] ?? [];

        BorrowedCheque::where(
            'borrower_no',
            $validated['borrowerNo']
        )->whereIn('id', $ids)
            ->chunkById(100, function ($checks) use ($request) {
                foreach ($checks as $check) {
                    $check->checkable?->chequeStatus()->create([
                        'status' => 'cancelled',
                        'cancelled_reason' => $request->reason,
                        'caused_by' => $request->user()->id,
                    ]);
                }
            });

        return redirect()
            ->route('cheque-requests')
            ->with([
                'status' => true,
                'message' => 'Successfully Updated',
            ]);
        // return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public static function borrowedRecords(array $filters)
    {
        return BorrowedCheque::select(
            'borrower_no',
            'reason',
            'approver_id',
            'borrower_name as borrower',
            DB::raw('COUNT(*) as total_checks'),
            DB::raw('MAX(created_at) as last_borrowed_at')
        )
            ->with('approver')
            ->notDs()
            ->has('approver')
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where(function ($q) use ($search) {

                    if (is_numeric($search)) { //FOR FILTERING BORROWER NUMBER
    
                        $clean = ltrim($search, '0');

                        $q->where('borrower_no', 'LIKE', "%{$clean}%");
                    }

                    $q->orWhere('borrower_name', 'LIKE', "%{$search}%");
                });
            })
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->whereNull('approved_at')
            ->groupBy('borrower_no', 'borrower_name', 'reason', 'approver_id')
            ->orderByDesc('borrower_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
    }

    public function changeApprover(Request $request)
    {
        $validated = $request->validate([
            // 'key' => 'required',
            'borrower' => 'required',
            'approver' => 'required|exists:approvers,id',
            'borrowerNo' => 'required'
        ]);

        $isSuccess = BorrowedCheque::where('borrower_no', $validated['borrowerNo'])
            ->update([
                'approver_id' => $validated['approver'],
                'borrower_name' => $validated['borrower']
            ]);

        if (!$isSuccess)
            return;

        return redirect()->back()->with(['status' => true, 'message' => 'Approver Updated']);
    }

    public function setToDepositSlip(Request $request)
    {
        $validated = $request->validate([
            'borrowedIds' => [
                'array',
                'min:1',
            ],
            'borrowerNo' => ['required', 'integer']
        ]);

        BorrowedCheque::where('borrower_no', $validated['borrowerNo'])
            ->whereIn('id', $validated['borrowedIds'])->update([
                    'is_ds' => true,
                ]);

        return redirect()
            ->route('cheque-requests')
            ->with([
                'status' => true,
                'message' => 'Successfully Updated',
            ]);
    }

    public function depositSlips(Request $request)
    {
        $filters = $request->only(['search']);
        $cheques = BorrowedCheque::where('is_ds', true)
            ->doesntHave('depositSlips')
            ->filter($filters)
            ->with('checkable')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('chequeRequests/depositSlips', [
            'cheques' => $cheques,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
            ],
        ]);
    }

    public function returnedCheques(Request $request)
    {
        $filters = $request->only(['search']);
        $cheques = ChequeStatus::whereRelation('chequeForwardedStatus', 'status', 'cancelled')
            ->with('checkable')
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('supervisor/returnedCheques', [
            'cheques' => $cheques,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
            ],
        ]);
    }

    public function uploadDepositSlips(Request $request)
    {

        $validated = $request->validate([
            'cheque_ids' => ['required', 'array', 'min:1'],
            'cheque_ids.*' => ['integer', 'exists:borrowed_cheques,id'],
            'deposit_slips' => ['required', 'array', 'min:1', 'max:10'],
            // max is in kilobytes: 5120 KB = 5 MB (matches the modal)
            'deposit_slips.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $storedPaths = [];
        try {
            DB::transaction(function () use ($request, $validated, &$storedPaths) {
                foreach ($request->file('deposit_slips') as $file) {
                    // Private disk: not publicly accessible via URL
                    $path = $file->store('deposit-slips', 'local');
                    $storedPaths[] = $path;

                    $slip = DepositSlip::create([
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'uploaded_by' => $request->user()->id,
                    ]);

                    // One slip can cover many cheques
                    $slip->borrowedCheques()->syncWithoutDetaching($validated['cheque_ids']);
                }

                $transactionNo = now()->format('YmdHis') . '-' . auth()->id();
                $userId = $request->user()->id;

                BorrowedCheque::whereIn(
                    'id',
                    $validated['cheque_ids']
                )->chunk(100, function (Collection $borrowedCheque) use ($transactionNo, $userId) {
                    foreach ($borrowedCheque as $cheque) {
                        $cheque->checkable->chequeStatus()->create([
                            'transaction_no' => $transactionNo,
                            'status' => 'released',
                            'receiver_name' => null,
                            'image' => null,
                            'signature' => null,
                            'caused_by' => $userId,
                        ]);
                    }
                });
            });
        } catch (Throwable $e) {
            // Don't leave orphaned files if the DB write failed
            Storage::disk('local')->delete($storedPaths);
            report($e);

            return back()->withErrors([
                'deposit_slips' => 'Upload failed. Please try again.',
            ]);
        }

        return back()->with(['status' => true, 'message' => 'Deposit slips uploaded successfully.']);
    }

    // public function show(DepositSlip $depositSlip): StreamedResponse
    // {
    //     // $this->authorize('view', $depositSlip);

    //     return Storage::disk('local')->response(
    //         $depositSlip->path,
    //         $depositSlip->original_name,
    //         ['Content-Type' => $depositSlip->mime_type],
    //     );
    // }

}