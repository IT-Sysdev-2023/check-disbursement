<?php

namespace App\Http\Controllers;

use App\Models\CvCheckPayment;
use App\Services\AssignedCheckNumberService;
use Illuminate\Http\Request;


class AssignedCheckNumberController extends Controller
{
    public function __construct(protected AssignedCheckNumberService $service)
    {
    }

    public function store(Request $request) // store
    {
        return $this->service->updateAssignCheckNumber($request);
    }

    public function storeCheckDate(Request $request)
    {
         return $this->service->updateAssignCheckDate($request);
    }
}
