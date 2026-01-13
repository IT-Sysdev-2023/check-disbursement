<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\BorrowedCheck;
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

    public function show(string $checkId, string $status)
    {
        return $this->service->getReleaseCheck($checkId, $status);
    }

    public function store(BorrowedCheck $id,  ReleasingCheckRequest $request)
    {
        return $this->service->storeReleaseCheck($id, $request);
    }

    public function cancel(BorrowedCheck $id, Request $request)
    {
       return $this->service->cancelCheck($id, $request);
    }

}
