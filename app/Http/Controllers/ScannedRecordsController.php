<?php

namespace App\Http\Controllers;

use App\Models\ScannedRecords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ScannedRecordsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function scan(Request $request)
    {
        $files = self::directory();

        foreach ($files as $file) {
            $contents = self::getContents($file);

            $lines = preg_split("/\r\n|\n|\r/", $contents);

            $headerTitle = null;

            foreach ($lines as $line) {
                $bu = trim($line);
                if ($bu !== '') {
                    $headerTitle = $bu;
                    break;
                }
            }

            foreach ($lines as $line) {

                // Skip empty lines and headers
                if (!preg_match('/^\s*\d+\s+\d{2}\/\d{2}\/\d{4}/', $line)) {
                    continue;
                }

                // Parse using regex (flexible for spacing)
                $pattern = '/^\s*(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+)\s+(\d+)\s+([A-Z- ]+)\s+([\d,]+\.\d{2})/';

                if (preg_match($pattern, $line, $m)) {

                    // $record = 
                    dd([
                        'seq' => $m[1],
                        'date' => $m[2],
                        'account_no' => $m[3],
                        'posted_date' => $m[4],
                        'check_no' => $m[5],
                        'branch_code' => $m[6],
                        'branch_name' => trim($m[7]),
                        'amount' => str_replace(',', '', $m[8]),
                    ], $headerTitle, $contents);

                    // dd($contents);
                    ScannedRecords::insertOrIgnore([
                        'bu' => $headerTitle,
                        'seq' => $m[1],
                        'date' => Date::createFromFormat('m/d/Y', $m[2]),
                        'account_no' => $m[3],
                        'posted_date' => Date::createFromFormat('m/d/Y', $m[4]),
                        'check_no' => $m[5],
                        'branch_code' => $m[6],
                        'branch_name' => trim($m[7]),
                        'amount' => str_replace(',', '', $m[8]),
                        'caused_by' => $request->user()->id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }

            }
        }
        dd($files);
    }


    private static function directory()
    {
        if (PHP_OS_FAMILY === 'Linux') {
            return File::files('/mnt/sharedTeo');
        }
        return Storage::disk('scanned')->files();//windows
    }

    private static function getContents($file)
    {
        if (PHP_OS_FAMILY === 'Linux') {
            return File::get($file);
        }
        return Storage::disk('scanned')->get($file);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScannedRecords $scannedRecords)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScannedRecords $scannedRecords)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScannedRecords $scannedRecords)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScannedRecords $scannedRecords)
    {
        //
    }
}
