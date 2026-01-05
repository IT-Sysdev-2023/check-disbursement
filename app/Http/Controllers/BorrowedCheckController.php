<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowedCheckRequest;
use App\Services\BorrowedCheckService;
use Illuminate\Http\Request;

class BorrowedCheckController extends Controller
{
    public function __construct(protected BorrowedCheckService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->borrowedChecks($request);
    }
    public function store(BorrowedCheckRequest $request)
    {
        return $this->service->store($request);
    }

    public function borrowerNames()
    {
        return $this->service->borrowerNames();
    }

}
