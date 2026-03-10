<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Services\CalendarHandler;
use App\Services\ChecksService;

use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
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
}
