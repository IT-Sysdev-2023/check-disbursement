<?php

namespace App\Services;

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
        $isCvHasNoCheckNumber = self::checkIfHasNoCheckNumber();


        dd(self::mergeRecords($filters));
        $chequeRecords = self::chequeRecords($filters, $defaultCheck, $isCvHasNoCheckNumber);

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
            'hasEmptyCheckNumber' => $isCvHasNoCheckNumber,
            'distinctMonths' => self::distinctMonths()
        ]);
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

    private static function chequeRecords($filters, string $defaultCheck, bool $hasNoCheckNumber)
    {
        $isActiveTab = ($filters['tab'] ?? null) === 'cheques';

        $loader = $defaultCheck === 'cv'
            ? fn() => self::cvRecords($filters, $hasNoCheckNumber)
            : fn() => self::crfRecords($filters);

        return $isActiveTab
            ? $loader()
            : Inertia::lazy($loader);
    }



    public static function checkIfHasNoCheckNumber()
    {
        return CvCheckPayment::where('check_number', 0)
            ->doesntHave('checkStatus')
            ->doesntHave('assignedCheckNumber')
            ->doesntHave('borrowedCheck')
            ->exists();
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

    private static function cvRecords(array $filters, ?bool $hasNoAmount = false)
    {
        return CvCheckPayment::
            select('cv_check_payments.id as id', 'companies.name as company_name', 'check_amount as amount', 'payee', 'tagged_at', DB::raw("'cv' as type"),  'cv_check_payments.created_at')
            ->join('companies', 'companies.id', '=', 'cv_check_payments.company_id')
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('borrowed_checks')
                    ->whereColumn('borrowed_checks.checkable_id', 'cv_check_payments.id');
            })
            ->when($hasNoAmount, function ($query) {
                $query->where('cv_check_payments.check_number', 0)
                    ->whereNotExists(function ($subQuery) {
                        $subQuery->select(DB::raw(1))
                            ->from('assigned_check_numbers')
                            ->whereColumn('assigned_check_numbers.cv_check_payment_id', 'cv_check_payments.id');
                    });
            }, function ($query) {
                $query->where(function ($q) {
                    $q->where('cv_check_payments.check_number', '!=', 0)
                        ->orWhereExists(function ($subQuery) {
                            $subQuery->select(DB::raw(1))
                                ->from('assigned_check_numbers')
                                ->whereColumn('assigned_check_numbers.cv_check_payment_id', 'cv_check_payments.id');
                        });
                });
            });
    }

    private static function crfRecords(array $filters)
    {
        return Crf::select('crfs.id',  'amount', 'paid_to', 'tagged_at', DB::raw("'crf' as type"), 'crfs.created_at')
            // ->leftJoin('companies', 'companies.id', '=', 'crfs.company_id')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('borrowed_checks')
                    ->where('checkable_type', Crf::class)
                    ->whereColumn('borrowed_checks.checkable_id', 'crfs.id');
            });
    }

    private static function mergeRecords($filters)
    {
        $cvQuery = self::cvRecords($filters);
        $crfQuery = self::crfRecords($filters);

        return $crfQuery->get();
        // return DB::query()
        //     ->fromSub(function ($q) use ($cvQuery, $crfQuery) {
        //         $q->fromSub($cvQuery, 'cv')
        //             ->unionAll($crfQuery);
        //     }, 'merged')
        //     ->orderBy('created_at', 'desc')
        //     // ->paginate(15);
        //     ->get();
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