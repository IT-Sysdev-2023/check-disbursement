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
    public function show(CvCheckPayment $id) //show
    {
        return $this->service->unassignCheck($id);
    }

    public function store(Request $request) // store
    {
        return $this->service->storeUnassignCheck($request);
    }
}
