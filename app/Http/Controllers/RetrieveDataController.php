<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RetrieveDataController extends Controller
{
    public function index()
    {
        // $con = Schema::connection('sqlsrvCaf')->getTables();
        // $tables = collect($con)->filter(function ($table) {
        //     return Str::contains($table['name'], 'CRF');
        // });
        // dd($tables);
        // $con = DB::connection('sqlsrvCaf')
        //         ->table('CARMEN AGRI FARM$CRF Header')
        //         ->get();
        //     dd($con);
        
        $con = DB::connection('sqlsrvCaf')
            ->table('CARMEN AGRI FARM$CRF Header')
            ->orderBy('CRF No_')
            ->chunkById(100, function ($headers) {
                $data = $headers->map(function ($item) {
                    return [
                        'crf_no' => $item->{'CRF No_'},
                        'crf_date' => $item->{'CRF Date'} ? Date::parse($item->{'CRF Date'}) : null,
                        'crf_status' => $item->{'CRF Status'},
                        'collection_schedule_date' => $item->{'Collection Schedule Date'} ? Date::parse($item->{'Collection Schedule Date'}) : null,
                        'collector_name' => $item->{'Collector Name'},
                        'vendor_no' => $item->{'Vendor No_'},
                        'vendor_name' => $item->{'Vendor Name'},
                        'fully_paid' => $item->{'Fully Paid'},
                        'no_series' => $item->{'No_ Series'},
                        'remarks' => $item->{'Remarks'},
                        'crf_type' => $item->{'CRF Type'},
                        'check_date' => $item->{'Check Date'} ? Date::parse($item->{'Check Date'}) : null,
                        'journal_batch_name' => $item->{'Journal Batch Name'},
                        'total_amt_for_allocation' => $item->{'Total Amt_ for Allocation'},
                        'journal_template_name' => $item->{'Journal Template Name'},
                    ];
                })->toArray();
                
                // Single bulk insert per chunk
                DB::table('caf_header')->insertOrIgnore($data);
                
            }, 'CRF No_');



        dd($con);

    }
}
