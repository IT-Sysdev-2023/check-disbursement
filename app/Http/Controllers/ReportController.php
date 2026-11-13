<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Helpers\ColumnResolver;
use App\Helpers\FileHandler;
use App\Models\Borrower;
use App\Models\ChequeStatus;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\TagLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    protected ?string $userType;
    public function __construct(protected FileHandler $fileHandler)
    {
        $this->userType = auth()->user()->roles->first()->name;
    }
    public function index(Request $request)
    {
        $columns = ColumnResolver::resolve();

        $bu = $request->user()
            ->companyPermissions()
            ->with('company:id,name')
            ->get()
            ->map(fn($permission) => [
                'label' => $permission->company->name,
                'value' => $permission->company->id,
            ])
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ])
            ->values();

        $excludedCheque = ['forwarded', 'released', 'deposited'];

        $chequeStatuses = ColumnResolver::statusColumnEnums()->reject(function ($item) use ($excludedCheque) {
            return in_array($item['label'], $excludedCheque, true);
        })->values();

        $reportSelection = [
            'pdc' => 'PDC Cheques',
            'vss' => 'Voucher Status Summary',
            'rc' => 'Released Cheques',
            'dc' => 'Deposited Cheques',
            'cc' => 'Cancelled Cheques',
            'fc' => 'Forwarded Cheques',
            'sc' => 'Stale Cheques',
            'ic' => 'Internal',
            'tpc' => 'Pickup',
        ];

        $user = $request->user();

        $restrictedRoles = [
            'corporate_disbursing_clerk(forwarded_releasing)',
            'corporate_disbursing_clerk(forwarded)',
        ];

        $locations = ['Cebu', 'Manila'];

        if ($user->hasAnyRole($restrictedRoles)) {
            $locations = [];

            if ($user->can('access cebu')) {
                $locations[] = 'Cebu';
            }

            if ($user->can('access manila')) {
                $locations[] = 'Manila';
            }
        }

        $borrower = Borrower::borrowerSelection();
        return Inertia::render('report/report', [
            'columns' => $columns,
            'chequeStatuses' => $chequeStatuses,
            'borrower' => $borrower,
            'locations' => $locations,
            'reportSelection' => $reportSelection,
            'bu' => $bu
        ]);

    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'startDate' => ['nullable', 'date_format:Y-m-d'],
            'endDate' => ['nullable', 'date_format:Y-m-d'],
            'selectedReport' => ['required', 'array', 'min:1'],
            'selectedReport.*' => 'string',
            'forwardedLocations' => ['nullable', 'array'],
            'forwardedLocations.*' => 'string',
            'columns' => 'required | array | min:1',
            'columns.*' => 'string',
            'bu' => ['nullable', 'array'],
        ]);

        $validated['columns'] = ColumnResolver::transformColumn($validated['columns']);

        if (!self::validateFilter($validated)) {
            return redirect()->back()->with(['status' => false, 'message' => 'No records found for the selected filters']);
        }

        $role = $this->userType;
        $date = now()->format('Ymd_His');

        $filename = "reports/{$role}/report-{$request->user()->id}-{$date}.xlsx";
        Excel::store(new ReportExport($validated), $filename, 'public');

        return redirect()->back()->with(['status' => true, 'message' => 'Report generated Generated']);
    }

    private static function validateFilter(array $columns)
    {
        $acronyms = $columns['selectedReport'];

        return collect($acronyms)->contains(function ($acronym) use ($columns) {
            $query = ChequeStatus::query()->when(
                !empty($columns['startDate']),
                fn($query) => $query->whereDate(
                    'created_at',
                    '>=',
                    $columns['startDate']
                )
            )
                ->when(
                    !empty($columns['endDate']),
                    fn($query) => $query->whereDate(
                        'created_at',
                        '<=',
                        $columns['endDate']
                    )
                )
                ->when(
                    !empty($columns['bu']),
                    fn($outerQuery) =>
                        $outerQuery->whereHasMorph(
                            'checkable',
                            [Cv::class, Crf::class],
                            fn(Builder $query) =>
                                $query->whereHas(
                                    'businessUnit.company',
                                    fn(Builder $query) =>
                                        $query->whereIn('name', $columns['bu'])
                                )
                        )
                );

            match ($acronym) {
                'pdc' => $query->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    function ($q, $type) {
                            $column = $type === Cv::class ? 'cv_date' : 'crf_date';
                            $q->whereColumn('cheque_date', '>', $column);
                        }
                ),

                'rc' => $query->where('status', 'released'),

                'cc' => $query->where('status', 'cancelled'),

                'fc' => $query->whereHas(
                    'chequeForwardedStatus',
                    fn($q) =>
                        $q->where('status', 'released')
                ),

                'sc' => $query->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    fn($q) => $q->where('cheque_date', '<', now()->subMonths(6))
                ),

                'ic' => $query->where('status', 'released')
                    ->whereHasMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($q) => $q->whereHas(
                            'tagLocation',
                            fn($q) => $q->where('location', 'Internal')
                        )
                    ),

                'dc' => $query->where('status', 'deposited')
                    ->whereHasMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($q) => $q->whereHas(
                            'tagLocation',
                            fn($q) => $q->where('location', 'Deposit')
                        )
                    ),

                'tpc' => $query->where('status', 'released')
                    ->whereHasMorph(
                        'checkable',
                        [Cv::class, Crf::class],
                        fn($q) => $q->whereHas(
                            'tagLocation',
                            fn($q) => $q->where('location', 'Tagbilaran Pick-up')
                        )
                    ),

                default => $query->whereRaw('1 = 0'),
            };

            return $query->exists();
        });
    }

    public function generatedReports(Request $request)
    {
        $getFiles = $this->fileHandler
            ->inFolder('reports')
            ->getFilesFromDirectory($this->userType, true);

        $files = $getFiles->transform(function ($item) {

            $extension = pathinfo($item, PATHINFO_EXTENSION);
            return [
                'file' => basename($item),
                'filename' => Str::of(basename($item))->basename('.' . $extension),
                'extension' => $extension,
                // 'icon' => $extension === 'pdf' ? 'pdf.png' : 'excel.png',
                'last_modified' => Date::createFromTimestamp(
                    $this->fileHandler->disk()->lastModified($item),
                    'Asia/Manila'
                )->format('M d, Y h:i A'),
            ];
        })->sortByDesc('date')->values();

        return Inertia::render('report/generatedReports', [
            'files' => $files,
        ]);
    }

    public function download(Request $request)
    {

        return $this->fileHandler
            ->inFolder('reports')
            ->download($request->file, $this->userType);
    }

}
