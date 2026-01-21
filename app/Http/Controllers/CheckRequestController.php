<?php

namespace App\Http\Controllers;

use App\Http\Resources\BorrowedCheckResource;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckRequestController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        $borrowedRecords = self::borrowedRecords();

        return Inertia::render('chequeRequests', [
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
            ->where([['borrower_no', $request->borrowerNo], ['approver_id', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )->get();
        return response()->json(BorrowedCheckResource::collection($records));
    }

    public function approveCheck(Request $request)
    {
        $request->validate([
            'borrowedNo' => ['required', 'array'],
            'approver' => ['required', 'integer'],
        ]);

        $isSuccess = BorrowedCheck::whereIn('id', $request->borrowedNo)
            ->update(['approved_at' => Date::now(), 'approver_id' => $request->approver]);

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Approved' : 'Failed to Approve']);
    }
    public function approver(Request $request)
    {
        $names = Approver::select('id', 'name')->get();

        $transform = $names->map(function ($name) {
            return [
                'label' => $name->name,
                'value' => $name->id,
            ];
        });

        return response()->json($transform);
    }

    public function borrowedNumberCheques(int $id)
    {
        $record = BorrowedCheck::with('checkable.tagLocation')
            ->where([['borrower_no', $id], ['approver_id', null]])
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn(Builder $query) => $query->has('checkStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('chequeRequests/borrowedCheques', [
            'cheques' => $record,
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
            'ids' => 'required|array',
        ]);

        BorrowedCheck::whereIn('id', $request->ids)
            ->chunkById(100, function ($checks) use ($request) {
                foreach ($checks as $check) {
                    $check->checkable?->checkStatus()->create([
                        'status' => 'cancel',
                        'cancelled_reason' => $request->reason,
                        'caused_by' => $request->user()->id,
                    ]);
                }
            });


        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public function borrowedRecords()
    {
        return BorrowedCheck::select(
            'borrower_no',
            'reason',
            'checkable_type',
            'borrowers.name as borrower',
            DB::raw('COUNT(*) as total_checks'),
            DB::raw('MAX(borrowed_checks.created_at) as last_borrowed_at')
        )
            ->join('borrowers', 'borrowers.id', '=', 'borrowed_checks.borrower_id')
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )
            ->whereNull('approver_id')
            ->groupBy('borrower_no', 'borrower_id', 'reason', 'borrowers.name', 'checkable_type')
            ->orderByDesc('borrower_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
    }
}
