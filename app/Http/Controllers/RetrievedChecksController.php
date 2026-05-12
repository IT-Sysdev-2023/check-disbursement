<?php

namespace App\Http\Controllers;

use App\Models\BorrowedCheck;
use App\Models\BusinessUnit;
use App\Models\InitialCheckCapture;
use App\Services\CalendarHandler;
use App\Services\ChecksService;

use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Redirect;
class RetrievedChecksController extends Controller
{

    public function __construct(protected ChecksService $service)
    {
    }

    public function index(Request $request)
    {
        return $this->service->records($request);
    }

    public function approver(Request $request)
    {
        return $this->service->approver($request);
    }

    public function approveCheck(Request $request)
    {
        return $this->service->approveCheck($request);
    }

    public function getLocation()
    {
        return $this->service->getLocation();
    }

    public function updateLocation(Request $request)
    {
        return $this->service->setLocation($request);
    }

    public function businessUnits(Request $request)
    {
        $bu = BusinessUnit::query()
            ->whereHas(
                'company',
                fn($q) =>
                $q->where('id', $request->company)
            )
            ->pluck('name', 'id')
            ->map(fn($label, $value) => compact('label', 'value'))
            ->values()
            ->prepend([
                'label' => 'All',
                'value' => 'all',
            ]);
        return response()->json($bu);
    }

    public function syncMissingData(Request $request)
    {
        return $this->service->syncData($request);
    }

    public function initialScan(Request $request)
    {
        $isSuccess = BorrowedCheck::findOrFail($request->id)->update([
                'was_scanned' => true,
                'doc_path' => 'path/sa/gi/scan'
        ]);
        return Redirect::back()->with(['status' => $isSuccess ? 'success' : 'failed', 'message' => $isSuccess ? 'Scan successfully' : 'Update Failed']);
    }

    // public function syncCheques(Request $request){
    //     $isSuccess = BorrowedCheck::findOrFail($request->id)->update([
    //             'was_sync' => true,
    //     ]);
    //     return Redirect::back()->with(['status' => $isSuccess ? 'success' : 'failed', 'message' => $isSuccess ? 'Scan successfully' : 'Update Failed']);
    // }
}
