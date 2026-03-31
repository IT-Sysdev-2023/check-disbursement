<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Http\Resources\ChequeCollection;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CheckBorrowingController extends Controller
{
      public function __construct(protected FileHandler $fileHandler)
    {
    }

    
    public function index(Request $request)
    {
        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date', 'tab']);
        $currentTab = $filters['tab'] ?? 'checks';

        $checks = new ChequeCollection(self::scannedChecks($filters, $currentTab === 'borrowed'));

        return Inertia::render('checkBorrowing/checkBorrowing', [
            'cheques' => $checks,
            'filter' => (object) [
                'selectedCompany' => $filters['company'] ?? 'all',
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $currentTab
            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => [],
        ]);
    }

    public function borrow(Request $request)
    {
        $request->validate([
            'type' => ['required', 'in:include,exclude'],
            "borrower" => ["required"],
            "item" => ["required"],
            "reason" => ["required"],
            'cheques' => [
                'array',
                Rule::requiredIf(fn() => $request->type === 'include'),
            ],
        ]);
        $ids = $request->cheques ?? [];
        $isSuccess = BorrowedCheck::
            when(
                $request->type == 'exclude',
                fn($q) => $q->whereNotIn('id', $ids)
                ,
                fn($q) => $q->whereIn('id', $ids)
            )->update([
                'item_borrowed' => $request->item,
                'secondary_reason' => $request->reason,
                'secondary_borrower' => $request->borrower,
            ]);


        //  $data = [
        //     'controlerNumber' => '',
        //     'borrowerName' => $request->borrower,
        //     'dateBorrowed' => now()->toFormattedDayDateString(),
        //     'company' => $companyNames,
        //     'businessUnit' => $companyNames,
        // ];

        // return $this->fileHandler
        //     ->inFolder('pdfs/borrowed/')
        //     ->createFileName($borrowerNo, auth()->user()->id, '.pdf')
        //     ->handlePdf($data, 'borrowedPdf');

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Updated' : 'Failed to Update']);

    }

    public static function scannedChecks(array $filters = [], bool $isBorrowed = false)
    {
        $callback = function (Builder $q) use ($isBorrowed) {

            if ($isBorrowed) {
                $q->whereNotNull(['approved_at', 'item_borrowed', 'secondary_reason', 'secondary_borrower'])
                    ->where('is_returned', 0);

            } else {
                $q->whereNotNull('approved_at')
                    ->whereNull(['item_borrowed', 'secondary_reason', 'secondary_borrower']);
            }
        };

        $cv = CvCheckPayment::
            baseColumns()
            ->doesntHave('checkStatus')
            ->scanRecords()
            ->join('borrowed_checks', 'borrowed_checks.checkable_id', '=', 'cv_check_payments.id')
            ->filter($filters)
            ->whereHas('borrowedCheck', $callback)
            ->addSelect(
                'borrowed_checks.id as borrowedCheckId'
            );

        $crf = Crf::
            baseColumns()
            ->doesntHave('checkStatus')
            ->scanRecords()
            ->join('borrowed_checks', 'borrowed_checks.checkable_id', '=', 'crfs.id')
            ->filter($filters)
            ->whereHas('borrowedCheck', $callback)
            ->addSelect(
                'borrowed_checks.id as borrowedCheckId'
            );

        $unionQuery = $cv->unionAll($crf);
        // dd($unionQuery->get());
        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->when($filters['sort'] ?? null, function (Builder $q, array $sort) {
                $q->orderBy(Str::snake($sort['field']), $sort['sort']);
            }, fn($q) => $q->orderByDesc('created_at'))
            ->paginate(10)
            ->withQueryString();
    }

    public function returnCheck(Request $request)
    {
        $request->validate([
            'type' => ['required', 'in:include,exclude'],
            'checks' => [
                'array',
                Rule::requiredIf(fn() => $request->type === 'include'),
            ],
        ]);

        $ids = $request->checks ?? [];
        $isSuccess = BorrowedCheck::
            when(
                $request->type == 'exclude',
                fn($q) => $q->whereNotIn('id', $ids)
                ,
                fn($q) => $q->whereIn('id', $ids)
            )
            ->update([
                'is_returned' => 1,
            ]);

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Updated' : 'Failed to Update']);
    }
}
