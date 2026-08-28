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
        $columns = ColumnResolver::resolve($request->check);


        $bu = $request->user()
            ->companyPermissions()
            ->with('company:id,name')
            ->get()
            ->map(fn($permission) => [
                'label' => $permission->company->name,
                'value' => $permission->company->id,
            ]);
        $borrower = Borrower::borrowerSelection();
        $location = TagLocation::locationSelection();
        return Inertia::render('report/report', [
            'columns' => $columns,
            // 'cvColumns' => ColumnResolver::TYPE_COLUMNS['cv'],
            // 'crfColumns' => ColumnResolver::TYPE_COLUMNS['crf'],
            'statuses' => ColumnResolver::statusColumnEnums(),
            'borrower' => $borrower,
            'location' => $location,
            'bu' => $bu
        ]);

    }

    public function generate(Request $request)
    {
        // return Excel::download(new ReportExport, 'report.xlsx');
        $validated = $request->validate([
            'selectedChecks' => 'required | array | min:1',
            'selectedChecks.*' => 'string',
            'columns' => 'required | array | min:1',
            'columns.*' => 'string',

            'borrower' => 'array',
            'location' => 'array',
            'status' => 'array',
            'bu' => 'array',
        ]);

        $validated['columns'] = ColumnResolver::transformColumn($validated['columns']);

        if (self::validateFilter($validated)) {
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
        return ChequeStatus::
            when(
                !empty($columns['date']),
                fn($query) =>
                $query->whereDate('created_at', $columns['date'])
            )
            ->when(
                !empty($columns['status']),
                fn($query) =>
                $query->where(function ($q) use ($columns) {
                    $q->whereHas('chequeForwardedStatus', function ($q) use ($columns) {
                        $q->whereIn('status', $columns['status']);
                    })
                        ->orWhere(function ($q) use ($columns) {
                            $q->whereDoesntHave('chequeForwardedStatus')
                                ->whereIn('status', $columns['status']);
                        });
                })
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
            )
            ->when(
                !empty($columns['location']),
                fn($outerQuery) =>
                $outerQuery->whereHasMorph(
                    'checkable',
                    [Cv::class, Crf::class],
                    fn(Builder $query) =>
                    $query->whereHas(
                        'tagLocation',
                        fn(Builder $query) =>
                        $query->whereIn('location', $columns['location'])
                    )

                )
            )->doesntExist();
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
