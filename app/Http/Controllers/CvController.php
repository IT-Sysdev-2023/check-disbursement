<?php

namespace App\Http\Controllers;
use App\Models\BusinessUnit;
use App\Models\Company;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Services\CvService;
use Illuminate\Http\Request;

class CvController extends Controller
{
    public function __construct(protected CvService $service)
    {
    }

    public function index(Request $request)
    {

        return $this->service->index($request->user());
    }

    public function extractCv(Request $request)
    {
        return $this->service->retrieveData($request);
    }

    public function details(Cv $id)
    {
        return $this->service->details($id);
    }

    public function signatureDetails(Cv $id)
    {
        return $this->service->signatureDetails($id);
    }

    public function businessUnits(Request $request)
    {
        return $this->service->businessUnits($request);
    }


}
