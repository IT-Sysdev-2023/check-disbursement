<?php

namespace App\Http\Controllers;

use App\Exports\CvReportExport;
use App\Exports\ReportExport;
use App\Helpers\ColumnResolver;
use App\Models\Borrower;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelExcel;

class ReportController extends Controller
{
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

        $cvColumns = isset($result['cv'])
            ? ColumnResolver::transformColumn($result['cv'])
            : [];

        $crfColumns = isset($result['crf'])
            ? ColumnResolver::transformColumn($result['crf'])
            : [];

        $filename = "reports/report-{$request->user()->id}.xlsx";
        Excel::store(new ReportExport($cvColumns, $crfColumns, $request->all()), $filename);

        return redirect()->back()->with(['status' => true, 'message' => 'Report generated Generated']);
    }

}
