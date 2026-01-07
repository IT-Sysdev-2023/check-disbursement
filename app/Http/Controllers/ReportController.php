<?php

namespace App\Http\Controllers;

use App\Helpers\ColumnResolver;
use App\Models\BorrowerName;
use App\Models\TagLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $columns = ColumnResolver::resolve($request->check);

        $borrower = BorrowerName::borrowerSelection();
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

}
