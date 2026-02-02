<?php

namespace App\Http\Controllers;

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

        $cvRecords = [];

        if (isset($result['cv'])) {
            // dd($result['cv']);
            $cvColumns = ColumnResolver::transformColumn($result['cv']);

            Excel::store(
                new ReportExport($cvColumns, $validated),
                'exports/report.xlsx',
                'local',
                ExcelExcel::XLSX
            );
        }
        dd(1);
        $crfRecords = [];
        if (isset($result['crf'])) {
            $transform = ColumnResolver::transformColumn($result['crf']);

            $crfRecords = CheckStatus::select($transform)
                ->join('crfs', 'crfs.id', '=', 'check_statuses.checkable_id')
                ->join('companies', 'crfs.company_id', '=', 'companies.id')
                ->join('borrowed_checks', 'crfs.id', '=', 'borrowed_checks.checkable_id')
                ->join('borrowers', 'borrowed_checks.borrower_id', '=', 'borrowers.id')
                ->join('tag_locations', 'crfs.tag_location_id', '=', 'tag_locations.id')
                ->leftJoin('approvers', 'borrowed_checks.approver_id', '=', 'approvers.id')
                ->where([['check_statuses.checkable_type', 'crf'], ['borrowed_checks.checkable_type', 'crf']])
                ->when(!empty($validated['status']), function ($query) use ($validated) {
                    $query->whereIn('check_statuses.status', $validated['status']);
                })
                ->when(!empty($validated['bu']), function ($query) use ($validated) {
                    $query->whereIn('companies.name', $validated['bu']);
                })
                ->when(!empty($validated['borrower']), function ($query) use ($validated) {
                    $query->whereIn('borrowers.name', $validated['borrower']);
                })
                ->when(!empty($validated['location']), function ($query) use ($validated) {
                    $query->whereIn('tag_locations.location', $validated['location']);
                })

                ->get();
        }

        dd($crfRecords, $cvRecords);
    }

}
