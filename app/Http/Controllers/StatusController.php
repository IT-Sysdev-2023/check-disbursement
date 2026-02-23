<?php

namespace App\Http\Controllers;

use App\Http\Resources\CvCheckPaymentCollection;
use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheck;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ScannedRecords;
use App\Services\PermissionService;
use App\Services\StatusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;

class StatusController extends Controller
{

    public function __construct(protected StatusService $service)
    {

    }

    public function checkStatus(Request $request)
    {
        return $this->service->checkStatus($request);
    }

    public function scannedRecordsAmountCheckNo(Request $request)
    {
        return $this->service->scannedRecordsAmountCheckNo($request);
    }

    public function scannedRecords(ScannedRecords $id)
    {
        return $this->service->scannedRecords($id);
    }

    public function cancelStale(BorrowedCheck $id, Request $request)
    {
        if(!$id) return Redirect::back()->withErrors(['message' => 'Check not found.']);
        
        $id->checkable?->checkStatus()->create([
                        'status' => 'cancelled',
                        'cancelled_reason' => $request->reason,
                        'caused_by' => $request->user()->id,
                    ]);
                    
        return Redirect::back()->with(['status' => 'success', 'message' => 'Check has been cancelled successfully.']);
    }
}