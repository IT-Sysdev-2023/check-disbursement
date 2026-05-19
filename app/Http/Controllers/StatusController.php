<?php

namespace App\Http\Controllers;


use App\Models\BorrowedCheque;
use App\Models\ScannedRecords;
use App\Services\StatusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class StatusController extends Controller
{

    public function __construct(protected StatusService $service)
    {

    }

    public function chequeStatus(Request $request)
    {
        return $this->service->chequeStatus($request);
    }

    public function scannedRecordsAmountCheckNo(Request $request)
    {
        return $this->service->scannedRecordsAmountCheckNo($request);
    }

    public function scannedRecords(ScannedRecords $id)
    {
        return $this->service->scannedRecords($id);
    }

    public function cancelStale(BorrowedCheque $id, Request $request)
    {
        if(!$id) return Redirect::back()->withErrors(['message' => 'Check not found.']);
        
        $id->checkable?->chequeStatus()->create([
                        'status' => 'cancelled',
                        'cancelled_reason' => $request->reason,
                        'caused_by' => $request->user()->id,
                    ]);
                    
        return Redirect::back()->with(['status' => 'success', 'message' => 'Check has been cancelled successfully.']);
    }
}