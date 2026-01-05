<?php

namespace App\Http\Controllers;

use App\Services\ChecksService;

use Illuminate\Http\Request;
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

    public function setLocation(Request $request)
    {
        return $this->service->setLocation($request);
    }
}
