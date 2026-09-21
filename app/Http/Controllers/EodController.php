<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Helpers\FileHandler;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;

use Inertia\Inertia;

class EodController extends Controller
{
    protected ?string $userType;
    public function __construct(protected FileHandler $fileHandler)
    {
        $this->userType = auth()->user()->roles->first()->name;
    }
    public function index(Request $request)
    {
        $statuses = ChequeStatus::select('status')
            ->distinct()
            ->pluck('status')
            ->map(fn($status) => [
                'value' => $status,
                'label' => ucwords(str_replace('_', ' ', $status)),
            ])
            ->prepend([
                'value' => 'closed',
                'label' => 'Closed',
            ])
            ->prepend([
                'value' => 'all',
                'label' => 'All Status',
            ]);
        $filters = $request->only('default');
        $data = ChequeStatus::with(['checkable' => ['borrowedCheque.approver', 'tagLocation', 'businessUnit'], 'chequeForwardedStatus'])
            ->whereDate('created_at', now())
            ->when(($filters['default'] ?? null) && $filters['default'] != 'all', function ($query) use ($filters) {
                if ($filters['default'] == 'closed') {
                    $query->where('is_closed', 1);
                    return;
                }
                $query->where('status', $filters['default']);
            })
            ->paginate()
            ->toResourceCollection();

        return Inertia::render('eodPage', [
            'records' => $data,
            'filter' => (object) [
                'closedOnly' => $filters['closedOnly'] ?? false,
                'default' => $filters['default'] ?? 'all'
            ],
            'statuses' => $statuses,

        ]);
    }

    public function generateEod(Request $request)
    {
        // dd($request->all());
        $data['filter'] = $request->filterStatus;

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

        if (self::validateFilter($data['date'])) {
            return response()->json(['message' => 'No records found for today'], 404);
        }

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

    private static function validateFilter($date)
    {
        return ChequeStatus::
            whereDate('created_at', $date)
            ->doesntExist();
    }


}
