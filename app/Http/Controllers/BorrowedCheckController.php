<?php

namespace App\Http\Controllers;


use App\Models\BorrowedCheque;
use App\Services\BorrowedCheckService;
use Illuminate\Http\Request;

class BorrowedCheckController extends Controller
{
    public function __construct(protected BorrowedCheckService $service)
    {
    }

    public function store(Request $request)
    {
        return $this->service->store($request);
    }

    public function borrower()
    {
        return $this->service->borrower();
    }

    public function pendingDetails(BorrowedCheque $id)
    {

        return $this->service->pendingDetails($id);
    }

}
