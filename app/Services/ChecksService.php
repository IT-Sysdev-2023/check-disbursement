<?php

namespace App\Services;

use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
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

        $chequeRecords = self::chequeRecords($filters, $defaultCheck, $isCvHasNoCheckNumber);
        $borrowedRecords = self::borrowedRecords($tab, $defaultCheck);
        $manageChecks = self::manageChecks($filters, $tab, $defaultCheck);

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
    private static function manageChecks($filters, string $tab, string $defaultCheck)
    {
        $isActiveTab = $tab === 'manageChecks';
        $loader = $defaultCheck === 'cv'
            ? fn() => self::cvManageChecks($filters)
            : fn() => self::crfManageCheck($filters);
        return $isActiveTab
            ? $loader()
            : Inertia::lazy($loader);
    }

    private static function cvManageChecks($filters)
    {
        return CvCheckPayment::withWhereHas('borrowedCheck', function ($query) {
            $query->with('approver:id,name')->whereNotNull('approver_id');
        })
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'assigned_check_numbers.check_number')
                    ->on('scanned_records.amount', '=', 'cv_check_payments.check_amount');
            })
            ->select(
                'cv_check_payments.id',
                'cv_check_payments.check_number',
                'cv_check_payments.payee',
                'cv_check_payments.cv_header_id',
                'cv_check_payments.company_id',
                'scanned_records.id as scanned_id',
            )
            ->filter($filters)
            ->with('company:id,name', 'cvHeader:id,cv_date,cv_no')
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function crfManageCheck($filters)
    {
        return Crf::withWhereHas('borrowedCheck', function ($query) {
            $query->with('approver:id,name')->whereNotNull('approver_id');
        })
            ->select('crfs.id', 'crfs.amount', 'crfs.ck_no', 'crf', 'company', 'no', 'paid_to', 'scanned_records.id as scanned_id', )
            ->leftJoin('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'crfs.ck_no')
                    ->on('scanned_records.amount', '=', 'crfs.amount');
            })
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function crfRecords(array $filters)
    {
        return Crf::with('borrowedCheck')
            ->select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by', 'tagged_at')
            ->doesntHave('checkStatus')
            ->doesntHave('borrowedCheck')
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
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
            ->join('borrowers', 'borrowers.id', '=', 'borrowed_checks.borrower_name_id')
            ->whereNull('approver_id')
            ->groupBy('borrower_no', 'borrower_name_id', 'reason', 'borrowers.name', 'checkable_type')
            ->orderByDesc('borrower_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
        return $tab === 'borrowed' ? $loader()
            : Inertia::lazy($loader);
    }

    private static function cvRecords(array $filters, ?bool $hasNoAmount = false)
    {

        return CvCheckPayment::with('cvHeader', 'borrowedCheck', 'company', 'assignedCheckNumber')
            ->select('check_date', 'check_amount', 'id', 'cv_header_id', 'company_id', 'payee', 'tagged_at')
            ->doesntHave('borrowedCheck')
            ->doesntHave('checkStatus')
            ->when($hasNoAmount, function ($query) {
                $query->where('check_number', 0)
                    ->doesntHave('assignedCheckNumber');
            }, function ($query) {
                $query->where(function ($q) {
                    $q->where('check_number', '!=', 0)
                        ->orHas('assignedCheckNumber');
                });
            })
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
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