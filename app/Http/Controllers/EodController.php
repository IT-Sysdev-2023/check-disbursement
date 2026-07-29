<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Helpers\FileHandler;
use App\Models\ChequeStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

use Inertia\Inertia;

class EodController extends Controller
{
    protected ?string $userType;
    public function __construct(protected FileHandler $fileHandler)
    {
        $this->userType = auth()->user()->roles->first()->name;
    }
    public function index()
    {
        $data = ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit'], 'chequeForwardedStatus'])
            ->whereDate('created_at', now())
            ->paginate()
            ->toResourceCollection();

        return Inertia::render('eodPage', [
            'records' => $data,
            'filter' => (object) [
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);
    }

    public function generateEod(Request $request)
    {
        $data['columns'] = [
            'no',
            'cheque_number',
            'cheque_amount',
            'cheque_date',
            'payee',
            'approver_name',
            'borrower_name',
            'location',
            'business_unit'
        ];
        $data['date'] = now()->format('Y-m-d');
        $role = $this->userType;
        $date = now()->format('Ymd_His');

        $filename = "eod-{$request->user()->id}-{$date}.xlsx";
        Excel::store(new ReportExport($data), $filename, 'public');

        return Excel::download(
            new ReportExport($data),
            $filename
        );
        //  return redirect()->back()->with(['status' => true, 'message' => 'EOD generated successfully',   'url' => Storage::disk('public')->get($filename)]);
    }
}
