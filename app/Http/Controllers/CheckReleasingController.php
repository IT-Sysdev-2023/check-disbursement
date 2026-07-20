<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\BorrowedCheque;
use App\Services\ChequeReleasingService;
use Illuminate\Http\Request;

class CheckReleasingController extends Controller
{

    public function __construct(protected ChequeReleasingService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Request $request)
    {
        return $this->service->getReleaseCheck($request->cheques, $request->status);
    }

    public function store(ReleasingCheckRequest $request)
    {
        return $this->service->storeReleaseCheck($request);
    }

}
