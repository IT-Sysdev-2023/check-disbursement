<?php

namespace App\Services;

use App\Enums\ProgressStatus;
use App\Events\CvProgress;
use App\Helpers\Calendar;
use App\Http\Resources\ChequeCollection;
use App\Jobs\CvDatabase;
use App\Models\Approver;
use App\Models\BorrowedCheque;
use App\Models\BusinessUnit;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\NavServer;
use App\Models\TagLocation;
use Illuminate\Bus\Batch;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Bus;
use Inertia\Inertia;
use Throwable;

class ChequeService
{

    public function records(Request $request)
    {
        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date', 'tab', 'assignment', 'isNavSelected', 'monthDetails', 'page']);
        $assignment = $filters['assignment'] ?? 'toAssign';
        $company = $filters['company'] ?? 'all';
        $tab = $filters['tab'] ?? 'calendar';

        // $chequeRecords = null;
        // $borrowedRecords = null;
        // $manageCheques = null;
        // $calendar = null;

        // if ($tab == 'cheques') {
        //     $chequeRecords = 
        // }

        // if ($tab == 'borrowed') {
        //     $borrowedRecords = ;
        // }

        // if ($tab == 'manageChecks') {
        //     $manageCheques = new ChequeCollection(self::manageChecks($filters));
        // }
        // if ($tab == 'calendar') {
        //     $calendar = Calendar::calendar($filters);
        // }
        // dd($chequeRecords);
        $records = self::chequeRecords($tab, $filters, $assignment);

        return Inertia::render('retrievedRecords', [
            'records' => $records,
            'filter' => (object) [
                'selectedCompany' => $company,
                'assignments' => $assignment,
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $tab
            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => BusinessUnit::businessUnits($company),
            'counts' => (object) [
                'toAssign' => self::countToAssign($filters),
                'completed' => self::countCompleted($filters)
            ],
        ]);
    }

    private static function chequeRecords(string $tab, array $filters, string $assignment)
    {
        $records = match ($tab) {
            'calendar' => Calendar::calendar($filters),
            'cheques' => new ChequeCollection(self::mergeRecords($filters, $assignment == 'toAssign')),
            'borrowed' => ChequeRequestService::borrowedRecords($filters),
            'manageChecks' => new ChequeCollection(self::manageChecks($filters)),
            default => null
        };

        return $records;
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
        // Get all the Navition Servers
        $buId = BusinessUnit::
            where('name', $validated['bu'])
            ->pluck('id', 'name')->values();

        $nav = NavServer::select('id', 'name', 'username', 'password', 'port')
            ->withWhereHas('navDatabases', function ($query) use ($buId) {
                $query->whereIn('business_unit_id', $buId)
                    ->with('navHeaderTable', 'navChequePaymentTable');
            })
            ->lazy();

        $id = $request->user()->id;
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
        $cv = Cv::
            baseColumns()
            ->doesntHave('chequeStatus')
            ->leftJoinScanRecords()

            ->filter($filters)
            ->addSelect(
                'borrowed_cheques.id as borrowedCheckId',
                // 'borrowed_cheques.is_returned',
                // 'borrowed_cheques.secondary_borrower',
                'borrowed_cheques.approved_at',
                DB::raw('COALESCE(approvers.name, approvers.name) as approver_name'),
                'scanned_records.id as scanned_id',
                'scanned_records.payee as scanned_payee',
                'scanned_records.amount as scanned_amount'
            );

        $crf = Crf::
            // whereHas('borrowedCheque', fn(Builder $builder) => $builder->whereNotNull('approver_id'))
            baseColumns()
            ->doesntHave('chequeStatus')
            ->leftJoinScanRecords()

            ->filter($filters)
            ->addSelect(
                'borrowed_cheques.id as borrowedCheckId',
                // 'borrowed_cheques.is_returned',
                // 'borrowed_cheques.secondary_borrower',
                'borrowed_cheques.approved_at',
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
            }, fn($q) => $q->orderByDesc('scanned_id'))
            ->paginate(10)
            ->withQueryString();
    }

    private static function pendingRecords(array $filters)
    {
        return BorrowedCheque::with('checkable')
            ->filter($filters)
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->whereNull('approved_at')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    public static function checkIfHasNoCheckNumber()
    {
        return Cv::where([['cheque_number', 0], ['resolved_cheque_number', null]])
            ->doesntHave('borrowedCheque')
            ->exists();
    }

    public static function checkIfHasNoCheckDate()
    {
        return Crf::where('resolved_cheque_date', null)
            ->doesntHave('borrowedCheque')
            ->exists();
    }

    private function countToAssign(array $filters)
    {
        $cvQuery = Cv::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque')
            ->where([['cheque_number', 0], ['resolved_cheque_number', null]]);

        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque')
            ->where('resolved_cheque_date', null);


        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'to_assign'
            )
            ->count();
    }
    private function countCompleted(array $filters)
    {
        $cvQuery = Cv::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque')
            ->where(function ($q) {
                $q->whereNotNull('resolved_cheque_number')
                    ->orWhere('cheque_number', '!=', 0);
            });
        // ->whereNotNull('resolved_check_number')
        // ->whereNot('check_number');

        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque')
            ->whereNotNull('resolved_cheque_date');

        return DB::query()
            ->fromSub(
                $cvQuery->unionAll($crfQuery),
                'completed'
            )
            ->count();
    }

    private static function mergeRecords(array $filters, bool $hasMissingField)
    {
        $cvQuery = Cv::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque');

        $crfQuery = Crf::baseColumns()
            ->filter($filters)
            ->doesntHave('borrowedCheque');

        if ($hasMissingField) { //ASSIGNMENT
            $cvQuery->where([['cheque_number', 0], ['resolved_cheque_number', null]]);
            $crfQuery->where('resolved_cheque_date', null);
        } else { // COMPLETED
            $cvQuery->where(function ($q) {
                $q->whereNotNull('resolved_cheque_number')
                    ->orWhere('cheque_number', '!=', 0);
            });
            $crfQuery->whereNotNull('resolved_cheque_date');
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

        $isSuccess = BorrowedCheque::whereIn('id', $request->borrowedNo)
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