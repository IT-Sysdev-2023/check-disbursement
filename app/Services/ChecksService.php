<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CalendarProgress;
use App\Events\CvProgress;
use App\Helpers\Calendar;
use App\Http\Controllers\CheckRequestController;
use App\Http\Resources\ChequeCollection;
use App\Http\Resources\ChequeResource;
use App\Jobs\CvDatabase;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\BusinessUnit;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\NavServer;
use App\Models\TagLocation;
use Illuminate\Bus\Batch;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Bus;
use Inertia\Inertia;
use Throwable;

class ChecksService
{

    public function records(Request $request)
    {
        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date', 'tab', 'assignment', 'isNavSelected', 'monthDetails', 'page']);
        $assignment = $filters['assignment'] ?? 'toAssign';
        $company = $filters['company'] ?? 'all';

        $chequeRecords = new ChequeCollection(self::mergeRecords($filters, $assignment == 'toAssign'));
        // $borrowedChecks = self::pendingRecords($filters);
        $borrowedRecords = ChequeRequestService::borrowedRecords($filters);
        $manageCheques = self::manageChecks($filters);
        return Inertia::render('retrievedRecords', [
            'cheques' => $chequeRecords ?? [],
            'pending' => $borrowedRecords,
            'manageChecks' => new ChequeCollection($manageCheques ?? []),
            'filter' => (object) [
                'selectedCompany' => $company,
                'assignments' => $assignment,
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $filters['tab'] ?? 'calendar'
            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
            'counts' => (object) [
                'toAssign' => self::countToAssign($filters),
                'completed' => self::countCompleted($filters)
            ],
            'calendar' => Calendar::calendar($filters),
        ]);
    }

    public function syncData(Request $request)
    {
        $validated = $request->validate(
            [
                'month' => 'required |integer',
                'year' => 'required |integer',
                'bu' => 'required|string'
            ]
        );

        $missingCheques = Calendar::getMissingRecordsNav($validated);

        $user = $request->user();

        // Get all the Navition Servers
        $buId = BusinessUnit::
            where('name', $validated['bu'])
            ->pluck('id', 'name')->values();

        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function ($query) use ($buId) {
                $query->whereIn('business_unit_id', $buId)
                    ->with('navHeaderTable', 'navLineTable', 'navCheckPaymentTable');
            })
            ->lazy();

        $id = $user->id;
        $allJobs = [];

        $date = (object) [
            'month' => $validated['month'],
            'year' => $validated['year']
        ];

        $nav->each(function (NavServer $server) use ($id, $date, &$allJobs, $missingCheques) {
            foreach ($server->navDatabases as $db) {
                $allJobs[] = new CvDatabase($server->id, $id, $date, $db->id, $missingCheques);
            }
        });
        $key = $validated['bu'] . '-' . $validated['year'] . '-' . $validated['month'];
        Bus::batch($allJobs)
            ->name("CV Import All Servers")
            ->then(function (Batch $batch) use ($id, $key) {
                CvProgress::dispatch($id, "Data Retrieval Completed", ProgressStatus::Finished, '', 0, 0, 0, $key);
            })
            ->catch(function (Batch $batch, Throwable $e) use ($id) {
                CvProgress::dispatch($id, "Data Retrieval Failed: " . $e->getMessage(), ProgressStatus::NoConnection);
            })
            ->dispatch();
    }

    public static function manageChecks(array $filters = [])
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
                'borrowed_checks.was_scanned as isScanned',
                // 'borrowed_checks.is_returned',
                // 'borrowed_checks.secondary_borrower',
                'borrowed_checks.approved_at',
                DB::raw('COALESCE(approvers.name, approvers.name) as approver_name'),
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
                'borrowed_checks.was_scanned as isScanned',
                // 'borrowed_checks.is_returned',
                // 'borrowed_checks.secondary_borrower',
                'borrowed_checks.approved_at',
                DB::raw('COALESCE(approvers.name, approvers.name) as approver_name'),
                'scanned_records.id as scanned_id',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $unionQuery = $cv->unionAll($crf);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->when($filters['sort'] ?? null, function (Builder $q, array $sort) {
                $q->orderBy(Str::snake($sort['field']), $sort['sort']);
            }, fn($q) => $q->orderByDesc('created_at'))
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
            ->whereNull('approved_at')
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

    private function countToAssign(array $filters)
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck')
            ->where([['check_number', 0], ['resolved_check_number', null]]);

        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck')
            ->where('resolved_check_date', null);


        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'to_assign'
            )
            ->count();
    }
    private function countCompleted(array $filters)
    {
        $cvQuery = CvCheckPayment::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck')
            ->where(function ($q) {
                $q->whereNotNull('resolved_check_number')
                    ->orWhere('check_number', '!=', 0);
            });
        // ->whereNotNull('resolved_check_number')
        // ->whereNot('check_number');

        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheck')
            ->whereNotNull('resolved_check_date');

        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'completed'
            )
            ->count();
    }

    private static function mergeRecords(array $filters, bool $hasMissingField)
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
            ->when($filters['sort'] ?? null, function (Builder $q, array $sort) {
                if ($sort['field'] !== 'scannedId') { // Manage Check Column Sorting
                    $q->orderBy(Str::snake($sort['field']), $sort['sort']);
                }
            })
            ->paginate(10)
            ->withQueryString();

    }



    public function approver(Request $request)
    {
        $names = Approver::approverSelection();

        return response()->json($names);
    }

    public function approveCheck(Request $request)
    {
        $request->validate([
            'borrowedNo' => ['required', 'array'],
            'approver' => ['required', 'integer'],
        ]);

        $isSuccess = BorrowedCheck::whereIn('id', $request->borrowedNo)
            ->update(['approved_at' => Date::now(), 'primary_approver_id' => $request->approver]);

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
            'cheques' => ['required'],
            'locationId' => ['required', 'integer'],
            // 'type' => ['required', 'in:cv,crf'],
        ]);

        foreach ($validated['cheques'] as $cheque) {
            $model = Relation::getMorphedModel($cheque['type']);

            $model::findOrFail($cheque['id'])
                ->update([
                    'tag_location_id' => $validated['locationId'],
                    'tagged_at' => now()
                ]);
        }

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Tagged']);
    }


}