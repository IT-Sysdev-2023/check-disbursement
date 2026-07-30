<?php

namespace App\Http\Controllers;


use App\Http\Requests\ReleasingCheckRequest;
use App\Models\ChequeStatus;
use App\Services\ForwardedChequeService;
use Illuminate\Http\Request;

class ForwardedChequeController extends Controller
{
    public function __construct(protected ForwardedChequeService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function cancelForwarded(ChequeStatus $id, Request $request)
    {
        return $this->service->cancelForwarded($id, $request);
    }
    public function update(ChequeStatus $id, Request $request)
    {
        return $this->service->update($id, $request);
    }

    public function showForwarded(string $id, string $status)
    {
        return $this->service->showForwarded($id, $status);
    }

    public function storeReleaseCheck(ReleasingCheckRequest $request)
    {
        return $this->service->storeReleaseCheck($request);
    }

    public function forwardedReleasing(Request $request)
    {
        return $this->service->forwardedReleasing($request);
    }

}
