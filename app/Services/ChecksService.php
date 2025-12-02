<?php

namespace App\Services;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChecksService
{
    public function records(?int $page, array $filters, User $user)
    {

        $distinctMonths = CvCheckPayment::select('check_date', DB::raw('count(*) as total'))
            ->doesntHave('checkStatus')
            ->groupBy('check_date')
            ->get()
            ->keyBy('check_date')
            ->groupBy(
                fn($date) =>
                $date->check_date->format('Y-m')
            );

        $cvRecords = self::cvRecords($filters, $page);

        $crfs = ($filters['selectedCheck'] ?? null) === 'cv'
            ? Inertia::lazy(fn() =>
                self::crfRecords($filters, $page))
            : self::crfRecords($filters, $page); // use when refresh( it doesnt load when refresh cause its on lazy)

        return Inertia::render('retrievedRecords', [
            'cv' => $cvRecords,
            'crf' => $crfs,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'company' => PermissionService::getCompanyPermissions($user),
            'distinctMonths' => $distinctMonths,
        ]);
    }

    private static function crfRecords(array $filters, ?int $page)
    {
        return Crf::with('borrowedCheck')
            ->select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by')
            ->doesntHave('checkStatus')
            ->filter($filters)
            ->paginate($page ?? 10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function cvRecords(array $filters, ?int $page)
    {
        return CvCheckPayment::with('cvHeader', 'borrowedCheck', 'company')
            ->select('check_date', 'check_amount', 'id', 'cv_header_id', 'company_id', 'payee')
            ->doesntHave('checkStatus')
            ->filter($filters)
            ->paginate($page ?? 10)
            ->withQueryString()
            ->toResourceCollection();
    }
}