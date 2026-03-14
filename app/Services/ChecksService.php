<?php

namespace App\Services;

use App\Helpers\Calendar;
use App\Http\Controllers\CheckRequestController;
use App\Http\Resources\ChequeCollection;
use App\Http\Resources\ChequeResource;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\BusinessUnit;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChecksService
{

    public function records(Request $request)
    {
        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date', 'tab', 'assignment']);
        $tab = $filters['tab'] ?? 'calendar';
        $assignment = $filters['assignment'] ?? 'toAssign';

        $chequeRecords = new ChequeCollection(self::mergeRecords($filters, $assignment == 'toAssign'));

        $borrowedChecks = self::pendingRecords($filters);

        $manageCheques = self::manageChecks($filters);
        $calendar = Calendar::calendar();

        return Inertia::render('retrievedRecords', [
            'cheques' => $chequeRecords,
            'pending' => $borrowedChecks,
            'manageChecks' => new ChequeCollection($manageCheques),
            'filter' => (object) [
                'selectedCompany' => $filters['company'] ?? 'all',
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $tab
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => 'all'
            ]),
            'businessUnits' => isset($filters['company']) ? self::businessUnits($filters['company']) : [],
            'counts' => (object) [
                'toAssign' => self::countToAssign(),
                'completed' => self::countCompleted()
            ],
            'calendar' => $calendar
        ]);
    }

    public static function manageChecks(array $filters)
    {
        // LAST OPTION : JOIN TYPE AND CHECKABLE
        // I DID THIS CAUSE WE CANNOT GET THE SCANNED RECORDS DATA
        $cv = CvCheckPayment::
            baseColumns()
            ->doesntHave('checkStatus')
            ->leftJoinScanRecords()
            ->filter($filters)
            ->addSelect(
                'borrowed_checks.id as borrowedCheckId',
                'approvers.name as approver_name',
                'scanned_records.id as scanned_id',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $crf = Crf::
            // whereHas('borrowedCheck', fn(Builder $builder) => $builder->whereNotNull('approver_id'))
            baseColumns()
            ->doesntHave('checkStatus')
            ->leftJoinScanRecords()
            ->filter($filters)
            ->addSelect(
                'borrowed_checks.id as borrowedCheckId',
                'approvers.name as approver_name',
                'scanned_records.id as scanned_id',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $unionQuery = $cv->unionAll($crf);

        return DB::query()
            ->fromSub(
                DB::query()
                    ->selectRaw('ROW_NUMBER() OVER (ORDER BY created_at DESC) as id, merged.*') //Create unique ID
                    ->fromSub($unionQuery, 'merged'),
                'final'
            )
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }

    private static function pendingRecords(array $filters)
    {
        return BorrowedCheck::with('checkable')
            ->filter($filters)
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn($query) => $query->has('checkStatus')
            )
            ->whereNull('approver_id')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

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

    private function countToAssign()
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->doesntHave('borrowedCheck')
            ->where([['check_number', 0], ['resolved_check_number', null]]);

        $crfQuery = Crf::baseColumns()
            ->doesntHave('borrowedCheck')
            ->where('resolved_check_date', null);
        ;


        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'to_assign'
            )
            ->count();
    }
    private function countCompleted()
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->doesntHave('borrowedCheck')
            ->where(function ($q) {
                $q->whereNotNull('resolved_check_number')
                    ->orWhere('check_number', '!=', 0);
            });
        // ->whereNotNull('resolved_check_number')
        // ->whereNot('check_number');

        $crfQuery = Crf::baseColumns()
            ->doesntHave('borrowedCheck')
            ->whereNotNull('resolved_check_date');

        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'completed'
            )
            ->count();
    }

    private static function mergeRecords($filters, bool $hasMissingField)
    {

        $cvQuery = CvCheckPayment::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck');
        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck');

        if ($hasMissingField) { //ASSIGNMENT
            $cvQuery->where([['check_number', 0], ['resolved_check_number', null]]);
            $crfQuery->where('resolved_check_date', null);
        } else { // COMPLETED
            $cvQuery->where(function ($q) {
                $q->whereNotNull('resolved_check_number')
                    ->orWhere('check_number', '!=', 0);
            });
            $crfQuery->whereNotNull('resolved_check_date');
        }

        $unionQuery = $cvQuery->unionAll($crfQuery);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->orderByDesc('created_at')
            ->orderBy('type')
            ->orderByDesc('cheque_id')
            ->paginate(10)
            ->withQueryString();
    }



    public function approver(Request $request)
    {
        $names = Approver::select('id as value', 'name as label')->get();

        return response()->json($names);
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

    public function getLocation()
    {
        $transform = TagLocation::locationSelection();

        return response()->json($transform);
    }

    public static function businessUnits($company)
    {
        return BusinessUnit::query()
            ->whereHas(
                'company',
                fn($q) =>
                $q->where('id', $company)
            )
            ->pluck('name', 'id')
            ->map(fn($label, $value) => compact('label', 'value'))
            ->values()
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ]);
    }

    public function setLocation(Request $request)
    {
        $validated = $request->validate([
            'id' => ['required', 'integer'],
            'locationId' => ['required', 'integer'],
            'type' => ['required', 'in:cv,crf'],
        ]);

        $model = Relation::getMorphedModel($validated['type']);

        $model::findOrFail($validated['id'])
            ->update([
                'tag_location_id' => $validated['locationId'],
                'tagged_at' => now()
            ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Tagged']);
    }


}