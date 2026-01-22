<?php

namespace App\Http\Controllers;

use App\Http\Resources\BorrowedCheckResource;
use App\Models\Approver;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\ChequeRequestService;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

}
