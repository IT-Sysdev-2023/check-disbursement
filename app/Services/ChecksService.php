<?php

namespace App\Services;

use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Http\Request;
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

        $borrowedRecords = ($filters['tab'] ?? null) === 'borrowed' ? self::borrowedRecords($filters, $filters['selectedCheck'] ?? 'cv')
            : null;


        $crfs = ($filters['selectedCheck'] ?? null) === 'crf' ? self::crfRecords($filters)
            : null;

        return Inertia::render('retrievedRecords', [
            'cv' => $cvRecords,
            'crf' => $crfs,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'borrowed' => $borrowedRecords,
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
            'distinctMonths' => self::distinctMonths()
        ]);
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
            ->exists();
    }

    public function borrowedRecords(array $filters, string $check)
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
            // ->with('borrowerName')
            // ->with($check === 'cv' ? 'cvCheckPayment.company' : 'crf')
            ->groupBy('borrower_no', 'borrower_name_id', 'reason', 'borrower_names.name', 'check')
            ->orderByDesc('borrower_no')
            // ->get()
            ->paginate(10)
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
            ->select('check_date', 'check_amount', 'id', 'cv_header_id', 'company_id', 'payee')
            ->doesntHave('borrowedCheck')
            ->doesntHave('checkStatus')
            // ->doesntHave('assignedCheckNumber')
            ->when($hasNoAmount, function ($query) {
                $query->where('check_number', 0);
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