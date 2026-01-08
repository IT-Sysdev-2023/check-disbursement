<?php

namespace App\Http\Controllers;

use App\Helpers\ColumnResolver;
use App\Models\Borrower;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $columns = ColumnResolver::resolve($request->check);

        $borrower = Borrower::borrowerSelection();
        $location = TagLocation::locationSelection();
        return Inertia::render('report/report', [
            'columns' => $columns,
            'cvColumns' => ColumnResolver::TYPE_COLUMNS['cv'],
            'crfColumns' => ColumnResolver::TYPE_COLUMNS['crf'],
            'statuses' => ColumnResolver::statusColumnEnums(),
            'borrower' => $borrower,
            'location' => $location,
        ]);

    }

    public function generate(Request $request)
    {
        // $request->validate([
        //     'selectedChecks' => 'required | array | min:1',
        //     'selectedChecks.*' => 'string',
        //     'columns' => 'required | array | min:1',
        //     'columns.*' => 'string',
        // ]);
        $result = [];

        foreach ($request->columns as $column) {
            foreach ($request->selectedChecks as $check) {
                if (in_array($column, ColumnResolver::TYPE_COLUMNS[$check], true)) {
                    $result[$check][] = $column;
                }

                if (in_array($column, ColumnResolver::DEFAULT_COLUMNS, true)) {
                    $result[$check][] = $column;
                }
            }
        }

        if (isset($result['cv'])) {
            $transform = array_map(
                fn($value) => Str::snake($value),
                $result['cv']
            );
            $data = CvCheckPayment::select($transform)
                ->leftjoin('cv_headers', 'cv_check_payments.cv_header_id', '=', 'cv_headers.id')
                ->join('tag_locations', 'cv_check_payments.tag_location_id', '=', 'tag_locations.id')
                ->join('companies', 'cv_check_payments.company_id', '=', 'companies.id')
                ->join('check_statuses', 'cv_check_payments.id', '=', 'check_statuses.checkable_id')
                ->join('borrowed_checks', 'cv_check_payments.id', '=', 'borrowed_checks.checkable_id')
                ->join('borrowers', 'borrowed_checks.borrower_id','=','borrowers.id')
                ->join('approvers', 'borrowed_checks.approver_id','=','approvers.id')
                ->where(['borrowed_checks.checkable_type' => 'cv', 'check_statuses.checkable_type' => 'cv'])
                ->get()
            ;

            dd($data);
        } else {
            dd(1);
        }
        dd($request->all(), $result);
    }

}
