<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\CrfService;
use App\Services\PermissionService;
use Illuminate\Support\Facades\Date;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CrfController extends Controller
{

    public function __construct(protected CrfService $service)
    {

    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function extractCrf(Request $request)
    {
        return $this->service->extract($request);
    }

    // public function retrievedCrf(Request $request)
    // {
    //     return $this->service->retrievedCrf($request);
    // }

    public function detailsCrf(Crf $id)
    {
        return $this->service->detailsCrf($id);
    }
}
