<?php

namespace App\Services;

use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChecksService
{
    public function records(?int $page, array $filters, Request $request)
    {
        //LAZY LOADING APPROACHING MOTHER F*CKERSSSSSSSS hAHAHAHHA

        if (self::checkIfHasNoCheckNumber()) {
            $cvRecords = ($filters['tab'] ?? null) === 'tableView' ? self::cvRecords($filters, true)
                : null;
        } else {
            $cvRecords = ($filters['tab'] ?? null) === 'tableView' ? self::cvRecords($filters)
                : null;
        }

        $borrowedRecords = ($filters['tab'] ?? null) === 'borrowed' ? self::borrowedRecords()
            : null;


        $crfs = ($filters['selectedCheck'] ?? null) === 'crf' ? self::crfRecords($filters)
            : null;

        $manageChecks = ($filters['tab'] ?? null) === 'manageChecks' ? self::manageChecks() : null;
        // dd(self::manageChecks());


        return Inertia::render('retrievedRecords', [
            'cv' => $cvRecords,
            'crf' => $crfs,
            'borrowed' => $borrowedRecords,
            'manageChecks' => $manageChecks,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
                'tab' => $filters['tab'] ?? 'calendar'
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
            'hasEmptyCheckNumber' => self::checkIfHasNoCheckNumber(),
            'distinctMonths' => self::distinctMonths()
        ]);
    }

    public function hasEmptyLocation(Collection $records)
    {
        if ($records)
            return $records->every(function ($record) {
                return $record->tag_location_id === null;
            });
    }

    public function manageChecks()
    {
        $checks = CvCheckPayment::withWhereHas('borrowedCheck', function ($query) {
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
            ->with('company:id,name', 'cvHeader:id,cv_date,cv_no')
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
        // $checks = BorrowedCheck::select(
        //     'borrower_no',
        //     'reason',
        //     'check',
        //     'borrower_names.name as borrower_name',
        //     DB::raw('COUNT(*) as total_checks'),
        //     DB::raw('MAX(borrowed_checks.created_at) as last_borrowed_at')
        // )
        //     ->join('borrower_names', 'borrower_names.id', '=', 'borrowed_checks.borrower_name_id')
        //     ->whereNot('approver_id', null)
        //     ->groupBy('borrower_no', 'borrower_name_id', 'reason', 'borrower_names.name', 'check')
        //     ->orderByDesc('borrower_no')
        //     ->paginate(5)
        //     ->withQueryString()
        //     ->toResourceCollection()
        // ;
        return $checks;
    }

    private static function crfRecords(array $filters)
    {
        return Crf::with('borrowedCheck')
            ->select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by')
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

    public function borrowedRecords()
    {
        $borrowed = BorrowedCheck::select(
            'borrower_no',
            'reason',
            'check',
            'borrower_names.name as borrower_name',
            DB::raw('COUNT(*) as total_checks'),
            DB::raw('MAX(borrowed_checks.created_at) as last_borrowed_at')
        )
            ->join('borrower_names', 'borrower_names.id', '=', 'borrowed_checks.borrower_name_id')
            ->where('approver_id', null)
            // ->with('borrowerName')
            // ->with($check === 'cv' ? 'cvCheckPayment.company' : 'crf')
            ->groupBy('borrower_no', 'borrower_name_id', 'reason', 'borrower_names.name', 'check')
            ->orderByDesc('borrower_no')
            // ->get()
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection()
        ;
        return $borrowed;
        // return CvCheckPayment::with('cvHeader', 'borrowedCheck', 'company', 'assignedCheckNumber')
        //     ->select('check_date', 'check_amount', 'id', 'cv_header_id', 'company_id', 'payee')
        //     ->doesntHave('checkStatus')
        //     // ->doesntHave('assignedCheckNumber')
        //     ->has('borrowedCheck')
        //     ->filter($filters)
        //     ->paginate(10)
        //     ->withQueryString()
        //     ->toResourceCollection();
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