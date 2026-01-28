<?php

namespace App\Services;

use App\Http\Controllers\CheckRequestController;
use App\Http\Resources\ChequeCollection;
use App\Http\Resources\ChequeResource;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
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
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'tab', 'assignment']);

        $tab = $filters['tab'] ?? 'calendar';

        $assignment = $filters['assignment'] ?? 'toAssign';

        // $hasMissingField = self::checkIfHasNoCheckNumber() || self::checkIfHasNoCheckDate();

        $chequeRecords = new ChequeCollection(self::mergeRecords($filters, $assignment == 'toAssign'));

        $waitingForApproval = self::pendingRecords();

        $manageCheques = self::manageChecks();

        return Inertia::render('retrievedRecords', [
            'cheques' => $chequeRecords,
            'pending' => $waitingForApproval,
            'manageChecks' => new ChequeCollection($manageCheques),
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
            // 'hasMissingFields' => $hasMissingField,
            'distinctMonths' => self::distinctMonths()
        ]);
    }

    public static function manageChecks()
    {
        // LAST OPTION : JOIN TYPE AND CHECKABLE
        // I DID THIS CAUSE WE CANNOT GET THE SCANNED RECORDS DATA
        $cv = CvCheckPayment::
            baseColumns()
            ->doesntHave('checkStatus')
            ->leftJoinScanRecords()
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

    private static function pendingRecords()
    {
        return BorrowedCheck::with('checkable')
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

    private static function mergeRecords($filters, bool $hasMissingField)
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck');

        $crfQuery = Crf::baseColumns()
            ->doesntHave('borrowedCheck');

        if ($hasMissingField) {
            $cvQuery->where([['check_number', 0], ['resolved_check_number', null]]);

            $crfQuery->where('resolved_check_date', null);
        } else {
            $cvQuery->whereNotNull('resolved_check_number')->whereNot('check_number');
            $crfQuery->whereNotNull('resolved_check_date');
        }

        $unionQuery = $cvQuery->unionAll($crfQuery);

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