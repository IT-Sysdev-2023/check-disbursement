<?php

namespace App\Http\Controllers;
use App\Services\CvService;

class CvController extends Controller
{
    public function __construct(protected CvService $service ){

    }
    public function index()
    {
        return $this->service->retrieveData();
    }
   
}
