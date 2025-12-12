<?php

namespace App\Http\Controllers;

use App\Events\ScanProgress;
use App\Models\ScannedRecords;
use App\Services\ScannedRecordsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ScannedRecordsController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected ScannedRecordsService $service){

    }
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function scan(Request $request)
    {
        return $this->service->scan($request->user()->id);
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
