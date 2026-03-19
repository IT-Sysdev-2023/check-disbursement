<?php

namespace App\Http\Controllers;

use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckBorrowingController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['company', 'bu', 'search', 'sort', 'date']);

        $records = BorrowedCheck::with('checkable.tagLocation')
            ->whereNotNull('approved_at')
            ->whereDoesntHaveMorph(
                'checkable',
                [CvCheckPayment::class, Crf::class],
                fn(Builder $query) => $query->has('checkStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();
            
        return Inertia::render('checkBorrowing/checkBorrowing', [
            'cheques' => $records,
            'filter' => (object) [
                'selectedCompany' => $filters['company'] ?? 'all',
                'selectedBu' => $filters['bu'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ],
            ],
            'company' => PermissionService::userAssignedCompany($request->user()),
            'businessUnits' => [],
        ]);
    }
}
