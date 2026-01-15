<?php

namespace App\Services;

use App\Http\Resources\ChequeCollection;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChecksService
{

    public function records(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'tab']);

        //LAZY LOADING APPROACHING MOTHER F*CKERSSSSSSSS hAHAHAHHA
        $defaultCheck = $filters['selectedCheck'] ?? 'cv';
        $tab = $filters['tab'] ?? 'calendar';

        // $isCvHasNoCheckNumber = self::checkIfHasNoCheckNumber();
        // $isCrfHasNoCheckDate = self::checkIfHasCheckDate();

        $chequeRecords = new ChequeCollection(self::mergeRecords($filters));
        // $chequeRecords = self::chequeRecords($filters, $defaultCheck, $isCvHasNoCheckNumber);

        $borrowedRecords = self::borrowedRecords($tab, $defaultCheck);

        $manageChecks = BorrowedCheck::with('checkable', 'approver')
            ->whereNotNull('approver_id')
            ->whereHasMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                function (Builder $query) {
                    $query->leftJoinScanRecords();
                }
            )
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('retrievedRecords', [

            'cheques' => $chequeRecords,
            'borrowed' => $borrowedRecords,
            'manageChecks' => $manageChecks,
            'defaultCheck' => $defaultCheck,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $tab
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
            // 'hasEmptyCheckNumber' => $isCvHasNoCheckNumber,
            'distinctMonths' => self::distinctMonths()
        ]);
    }

    // private static function chequeRecords($filters, string $defaultCheck, bool $hasNoCheckNumber)
    // {
    //     $isActiveTab = ($filters['tab'] ?? null) === 'cheques';

    //     $loader = $defaultCheck === 'cv'
    //         ? fn() => self::cvRecords($filters, $hasNoCheckNumber)
    //         : fn() => self::crfRecords($filters);

    //     return $isActiveTab
    //         ? $loader()
    //         : Inertia::lazy($loader);
    // }



    public static function checkIfHasNoCheckNumber()
    {
        return CvCheckPayment::where([['check_number', 0], ['resolved_check_number', null]])
            ->doesntHave('borrowedCheck')
            ->exists();
    }

    public static function checkIfHasNoCheckDate()
    {
        return Crf::where('resolved_check_date', null)
            ->doesntHave('borrowedCheck')
            ->exists();
    }

    private static function mergeRecords($filters)
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->doesntHave('borrowedCheck')
            ->when(self::checkIfHasNoCheckNumber(), function (Builder $builder) {
                $builder->where([['check_number', 0], ['resolved_check_number', null]]);
            });

        $crfQuery = Crf::baseColumns()
            ->doesntHave('borrowedCheck')
            ->when(self::checkIfHasNoCheckDate(), function (Builder $builder) {
                $builder->where('resolved_check_date', null);
            });

        // Create union first
        $unionQuery = $cvQuery->unionAll($crfQuery);

        // Use union as a subquery to order results
        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
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

    public function approveCheck(Request $request)
    {
        $request->validate([
            'borrowedNo' => ['required', 'integer'],
            'approver' => ['required', 'integer'],
        ]);
        BorrowedCheck::where('borrower_no', $request->borrowedNo)
            ->update(['approved_at' => Date::now(), 'approver_id' => $request->approver]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Approved']);
    }

    public function getLocation()
    {
        $transform = TagLocation::locationSelection();

        return response()->json($transform);
    }

    public function setLocation(Request $request)
    {
        $request->validate([
            'checkId' => ['required', 'integer'],
            'locationId' => ['required', 'integer'],
            'check' => ['required', 'string'],
        ]);

        $model = $request->check === 'cv' ? CvCheckPayment::class : Crf::class;

        $model::where('id', $request->checkId)->update(['tag_location_id' => $request->locationId, 'tagged_at' => now()]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Tagged']);
    }

    public function borrowedRecords(string $tab, string $selectedCheck)
    {
        $loader = fn() => BorrowedCheck::select(
            'borrower_no',
            'reason',
            'checkable_type',
            'borrowers.name as borrower_name',
            DB::raw('COUNT(*) as total_checks'),
            DB::raw('MAX(borrowed_checks.created_at) as last_borrowed_at')
        )
            ->join('borrowers', 'borrowers.id', '=', 'borrowed_checks.borrower_id')
            ->whereNull('approver_id')
            ->groupBy('borrower_no', 'borrower_id', 'reason', 'borrowers.name', 'checkable_type')
            ->orderByDesc('borrower_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        return $tab === 'borrowed' ? $loader()
            : Inertia::lazy($loader);
    }
    private static function distinctMonths()
    {
        return CvCheckPayment::select('cv_headers.cv_date', DB::raw('count(*) as total'))
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->doesntHave('checkStatus')
            ->groupBy('cv_headers.cv_date')
            ->get()
            ->groupBy(
                fn($date) =>
                Date::parse($date->cv_date)->format('Y-m')
            );
    }
}