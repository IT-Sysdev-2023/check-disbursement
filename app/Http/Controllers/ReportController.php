<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Helpers\ColumnResolver;
use App\Helpers\FileHandler;
use App\Models\Borrower;
use App\Models\TagLocation;
use Illuminate\Http\Request;
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
            'cvColumns' => ColumnResolver::TYPE_COLUMNS['cv'],
            'crfColumns' => ColumnResolver::TYPE_COLUMNS['crf'],
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
        ]);

       
        $result = [];

        foreach ($validated['columns'] as $column) {
            foreach ($validated['selectedChecks'] as $check) {
                if (in_array($column, ColumnResolver::TYPE_COLUMNS[$check], true)) {
                    $result[$check][] = $column;
                }

                if (in_array($column, ColumnResolver::DEFAULT_COLUMNS, true)) {
                    $result[$check][] = $column;
                }
            }
        }

         dd($result);

        $cvColumns = isset($result['cv'])
            ? ColumnResolver::transformColumn($result['cv'])
            : [];

        $crfColumns = isset($result['crf'])
            ? ColumnResolver::transformColumn($result['crf'])
            : [];

        $role = $this->userType;
        $date = now()->format('Ymd_His');

        $filename = "reports/{$role}/report-{$request->user()->id}-{$date}.xlsx";
        Excel::store(new ReportExport($cvColumns, $crfColumns, $request->all()), $filename, 'public');

        return redirect()->back()->with(['status' => true, 'message' => 'Report generated Generated']);
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
