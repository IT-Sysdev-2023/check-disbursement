<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Requests\BorrowedCheckRequest;
use App\Http\Resources\CvCheckPaymentResource;
use App\Models\Approver;
use App\Models\AssignedCheckNumber;
use App\Models\BorrowedCheck;
use App\Models\BorrowerName;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use App\Services\ChecksService;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
