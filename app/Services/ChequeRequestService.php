<?php

namespace App\Services;

use App\Helpers\NumberHelper;
use App\Http\Resources\BorrowedCheckResource;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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
        $records = BorrowedCheck::with('checkable')
            ->where([['borrower_no', $request->borrowerNo], ['approved_at', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )
            ->get();
        return response()->json(BorrowedCheckResource::collection($records));
    }

    public function approveCheck(Request $request)
    {
        $request->validate([
            'type' => ['required', 'in:include,exclude'],
            'borrowedNo' => [
                'array',
                Rule::requiredIf(fn() => $request->type === 'include'),
            ],
            'approver' => ['required', 'integer'],
        ]);
        $ids = $request->borrowedNo ?? [];

        $isSuccess = BorrowedCheck::
            when(
                $request->type == 'exclude',
                fn($q) => $q->whereNotIn('id', $ids)
                ,
                fn($q) => $q->whereIn('id', $ids)
            )
            ->update(['approved_at' => Date::now(), 'approver_id' => $request->approver]);

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Approved' : 'Failed to Approve']);
    }

    public function approver()
    {
        $names = Approver::approverSelection();

        return response()->json($names);
    }

    public function borrowedNumberCheques(int $id)
    {
        $record = BorrowedCheck::with('checkable.tagLocation')
            ->where([['borrower_no', $id], ['approved_at', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn(Builder $query) => $query->has('checkStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        $selection = Approver::approverSelection();
        return Inertia::render('chequeRequests/borrowedCheques', [
            'cheques' => $record,
            'approvers' => $selection,
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
        $request->validate([
            'reason' => 'required|string|max:255',
            // 'type' => ['required', 'in:include,exclude'],
            'ids' => [
                'array',
                Rule::requiredIf(fn() => $request->type === 'include'),
            ],
        ]);

        $ids = $request->ids ?? [];
  
        BorrowedCheck::
            when(
                isset($request->type) &&
                $request->type == 'exclude',
                fn($q) => $q->whereNotIn('id', $ids)
                ,
                fn($q) => $q->whereIn('id', $ids)
            )
            ->chunkById(100, function ($checks) use ($request) {
                foreach ($checks as $check) {
                    $check->checkable?->checkStatus()->create([
                        'status' => 'cancelled',
                        'cancelled_reason' => $request->reason,
                        'caused_by' => $request->user()->id,
                    ]);
                }
            });

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public static function borrowedRecords(array $filters)
    {
        return BorrowedCheck::select(
            'borrower_no',
            'reason',
            'borrowers.name as borrower',
            DB::raw('COUNT(*) as total_checks'),
            DB::raw('MAX(borrowed_checks.created_at) as last_borrowed_at')
        )
            ->join('borrowers', 'borrowers.id', '=', 'borrowed_checks.borrower_id')
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where(function ($q) use ($search) {

                    if (is_numeric($search)) { //FOR FILTERING BORROWER NUMBER
    
                        $clean = ltrim($search, '0');

                        $q->where('borrower_no', 'LIKE', "%{$clean}%");
                    }

                    $q->orWhere('borrowers.name', 'LIKE', "%{$search}%");
                });
            })
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )
            ->whereNull('approved_at')
            ->groupBy('borrower_no', 'borrower_id', 'reason', 'borrowers.name')
            ->orderByDesc('borrower_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
    }

    public function changeApprover(Request $request)
    {
        $validated = $request->validate([
            // 'key' => 'required',
            'approver' => 'required|exists:approvers,id',
            'borrower' => 'required'
        ]);

        $isSuccess = BorrowedCheck::where('borrower_no', $validated['borrower'])->update(['secondary_approver_id' => $validated['approver']]);
        if (!$isSuccess)
            return;

        return redirect()->back()->with(['status' => true, 'message' => 'Approver Updated']);
    }
}