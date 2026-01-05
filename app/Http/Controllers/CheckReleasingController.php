<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Http\Requests\ReleasingCheckRequest;
use App\Services\CheckReleasingService;
use Illuminate\Http\Request;

class CheckReleasingController extends Controller
{

    public function __construct(protected CheckReleasingService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(string $checkId, string $status, string $check)
    {
        return $this->service->getReleaseCheck($checkId, $status, $check);
    }

    public function store(ReleasingCheckRequest $request)
    {
        return $this->service->storeReleaseCheck($request);
    }

    public function cancel(int $id, Request $request)
    {
       return $this->service->cancelCheck($id, $request);
    }
}
