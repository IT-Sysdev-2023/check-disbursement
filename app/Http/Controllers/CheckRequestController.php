<?php

namespace App\Http\Controllers;


use App\Services\ChequeRequestService;
use Illuminate\Http\Request;

class CheckRequestController extends Controller
{

    public function __construct(protected ChequeRequestService $service)
    {

    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function borrowedChecks(Request $request)
    {
        return $this->service->borrowedChecks($request);
    }

    public function approveCheck(Request $request)
    {
        return $this->service->approveCheck($request);
    }
    public function approver()
    {
        return $this->service->approver();
    }

    public function borrowedNumberCheques(int $id)
    {
        return $this->service->borrowedNumberCheques($id);
    }

    public function cancelCheck(Request $request)
    {
        return $this->service->cancelCheck($request);
    }

    public function changeApprover(Request $request) {
        return $this->service->changeApprover($request);
    }
}
