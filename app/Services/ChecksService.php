<?php

namespace App\Services;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChecksService
{
    public function records(?int $page, array $filters, User $user)
    {

        $distinctMonths = CvCheckPayment::select('cv_headers.cv_date', DB::raw('count(*) as total'))
            ->join('cv_headers', 'cv_headers.id', '=', 'cv_check_payments.cv_header_id')
            ->doesntHave('checkStatus')
            ->groupBy('cv_headers.cv_date')
            ->get()
            ->groupBy(
                fn($date) =>
                Date::parse($date->cv_date)->format('Y-m')
            );

        $cvRecords = Inertia::lazy(fn() => self::cvRecords($filters, $page));

        $cvNoCheckNo = Inertia::lazy(fn() => self::cvRecords($filters, $page, true));

        $crfs =
            // ($filters['selectedCheck'] ?? null) === 'cv'
            //     ? 
            Inertia::lazy(fn() =>
                self::crfRecords($filters, $page));
        // : self::crfRecords($filters, $page); // use when refresh( it doesnt load when refresh cause its on lazy)

        return Inertia::render('retrievedRecords', [
            'cv' => $cvRecords,
            'crf' => $crfs,
            'cvEmptyCheckNo' => $cvNoCheckNo,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'company' => PermissionService::getCompanyPermissions($user)->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
            'distinctMonths' => $distinctMonths,
        ]);
    }

    private static function crfRecords(array $filters, ?int $page)
    {
        return Crf::with('borrowedCheck')
            ->select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by')
            ->doesntHave('checkStatus')
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function cvRecords(array $filters, ?int $page, ?bool $hasNoAmount = false)
    {
        return CvCheckPayment::with('cvHeader', 'borrowedCheck', 'company')
            ->select('check_date', 'check_amount', 'id', 'cv_header_id', 'company_id', 'payee')
            ->doesntHave('checkStatus')
            ->doesntHave('assignedCheckNumber')
            ->when($hasNoAmount, function ($query) {
                $query->where('check_number', 0);
            }, function ($query) {
                $query->whereNot('check_number', 0);
            })
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }
}