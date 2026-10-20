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
use App\Models\ChequeRecord;
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

        // $records = ChequeRecord::with('source')->limit(10)->get();
        // dd($records);

        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date', 'tab', 'assignment', 'isNavSelected', 'monthDetails', 'page', 'documentType']);
        $assignment = $filters['assignment'] ?? 'toAssign';
        $company = $filters['company'] ?? 'all';
        $tab = $filters['tab'] ?? 'calendar';

        $records = self::chequeRecords($tab, $filters, $assignment);
        $notScannedCheque = self::notScannedCheques();

        return Inertia::render('retrievedRecords', [
            'records' => $records,
            'notScannedCheques' => $notScannedCheque,
            'filter' => (object) [
                'selectedCompany' => $company,
                'assignments' => $assignment,
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'documentType' => $filters['documentType'] ?? 'all',
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
        $cheques = ChequeRecord::
            filter($filters)
            ->when(
                $assignment == 'toAssign',
                fn($q) => $q->where(fn($query) =>
                    $query->whereNull('cheque_number')
                        ->orWhereNull('cheque_date')),

                fn($q) => $q->whereNotNull('cheque_number')
                    ->whereNotNull('cheque_date')
            )
            ->orderByDesc('created_at')
            ->doesntHave('source.borrowedCheque')
            ->paginate()
            ->withQueryString();

        $records = match ($tab) {
            'calendar' => Calendar::calendar($filters),
            'cheques' => new ChequeCollection($cheques),
            'borrowed' => ChequeRequestService::borrowedRecords($filters),
            'manageChecks' => new ChequeCollection(self::manageChecks($filters)),
            default => null
        };

        return $records;
    }

    private static function notScannedCheques()
    {
        return BorrowedCheque::whereDoesntHaveMorph(
            'checkable',
            [Cv::class, Crf::class],
            fn($query) => $query->has('chequeStatus')
        )->doesntHave('scannedRecord')->whereNotNull('approver_id')
            ->with([
                'checkable' => function ($query) {
                    $query->select('id', 'cheque_number');
                }
            ])
            ->get()
            ->pluck('checkable.cheque_number')
            ->implode(', ');

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

        $nav = NavServer::select('id', 'host', 'username', 'password', 'port')
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
        // $cv = Cv::
        //     baseColumns()
        //     ->doesntHave('chequeStatus')
        //     ->leftJoinScanRecords()

        //     ->filter($filters)
        //     ->addSelect(
        //         'borrowed_cheques.id as borrowedCheckId',
        //         'borrowed_cheques.approved_at',
        //         'approvers.name as approver_name',
        //         'scanned_records.id as scanned_id',
        //         'scanned_records.payee as scanned_payee',
        //         'scanned_records.amount as scanned_amount'
        //     );

        // $crf = Crf::
        //     baseColumns()
        //     ->doesntHave('chequeStatus')
        //     ->leftJoinScanRecords()

        //     ->filter($filters)
        //     ->addSelect(
        //         'borrowed_cheques.id as borrowedCheckId',
        //         'borrowed_cheques.approved_at',
        //         'approvers.name as approver_name',
        //         'scanned_records.id as scanned_id',
        //         'scanned_records.payee as scanned_payee',
        //         'scanned_records.amount as scanned_amount'
        //     );

        // $unionQuery = $cv->unionAll($crf);

        $cheques = ChequeRecord::leftJoin('borrowed_cheques', function ($join) {
            $join->on('borrowed_cheques.checkable_id', '=', 'cheque_records.source_id')
                ->whereRaw("
                (
                    cheque_records.type = 'cv'
                    AND borrowed_cheques.checkable_type = ?
                )
                OR
                (
                    cheque_records.type = 'crf'
                    AND borrowed_cheques.checkable_type = ?
                )
            ", [
                    Cv::class,
                    Crf::class,
                ]);
        })
            ->leftJoin('approvers', 'approvers.id', '=', 'borrowed_cheques.approver_id')
            ->whereNotNull('borrowed_cheques.approved_at')
            ->leftJoin('scanned_records', 'scanned_records.borrowed_cheque_id', '=', 'borrowed_cheques.id')
            ->orderByDesc('scanned_records.id')
            ->paginate(10)
            ->withQueryString();

        return $cheques;
        // dd($cheques);

        // return DB::query()
        //     ->fromSub($cheques, 'merged')
        //     ->when($filters['sort'] ?? null, function (Builder $q, array $sort) {
        //         $q->orderBy(Str::snake($sort['field']), $sort['sort']);
        //     }, fn($q) => $q->orderByDesc('scanned_id'))
        //     ->paginate(10)
        //     ->withQueryString();
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
        return ChequeRecord::filter($filters)
            ->where(fn($q) => $q->whereNull('cheque_number')->orWhereNull('cheque_date'))
            ->doesntHave('source.borrowedCheque')
            ->limit(100)
            ->count();
    }
    private function countCompleted(array $filters)
    {
        return ChequeRecord::filter($filters)
            ->where(fn($q) => $q->whereNotNull('cheque_number')->orWhereNotNull('cheque_date'))
            ->doesntHave('source.borrowedCheque')
            ->limit(100)
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
            $cvQuery
                ->where('cvs.cheque_number', 0)
                ->whereNull('cvs.resolved_cheque_number')
                ->whereNull('crf_id');

            $crfQuery->whereNull('crfs.cheque_date')
                ->whereNull('crfs.resolved_cheque_date')
                ->doesntHave('cv');

        } else { // COMPLETED
            $cvQuery->where(function ($q) {
                $q->whereNotNull('cvs.resolved_cheque_number')
                    ->orWhere('cvs.cheque_number', '!=', 0)
                    ->orWhereNotNull('crf_id');
            });
            $crfQuery->where(function ($query) {
                $query->whereNotNull('crfs.cheque_date')
                    ->orWhereNotNull('crfs.resolved_cheque_date')
                    ->orHas('cv');
            });
        }

        // COMBINE
        if (($filters['documentType'] ?? null) === 'combine') {

            $cvQuery->whereNotNull('crf_id');
            $crfQuery->whereRaw('1 = 0');
        }

        $unionQuery = $cvQuery->unionAll($crfQuery);

        return DB::query()
            ->fromSub($unionQuery, 'merged')
            ->when($filters['sort'] ?? null, function (Builder $q, array $sort) {
                if ($sort['field'] !== 'scannedId') { // Manage Check Column Sorting
                    $q->orderBy(Str::snake($sort['field']), $sort['sort']);
                }
            })
            ->when(
                ($filters['documentType'] ?? null) && !in_array($filters['documentType'], ['all', 'combine']),
                function (Builder $builder) use ($filters) {
                    $builder->where('type', $filters['documentType']);
                }
            )

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