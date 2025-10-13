<?php

namespace App\Http\Controllers;
use App\Services\CvService;
use Illuminate\Http\Request;

class CvController extends Controller
{
    public function __construct(protected CvService $service ){

    }
    public function index(Request $request)
    {
        return $this->service->retrieveData($request->user());
    }
   
}
