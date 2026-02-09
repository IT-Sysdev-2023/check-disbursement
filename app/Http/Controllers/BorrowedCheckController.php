<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowedCheckRequest;
use App\Http\Resources\BorrowedCheckResource;
use App\Models\BorrowedCheck;
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

    public function pendingDetails(BorrowedCheck $id){

        // dd($id->load('checkable'));
        return response()->json(new BorrowedCheckResource($id->load('checkable.tagLocation')));
    }

}
