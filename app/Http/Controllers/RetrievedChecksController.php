<?php

namespace App\Http\Controllers;

use App\Services\ChecksService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class RetrievedChecksController extends Controller
{

    public function __construct(protected ChecksService $service)
    {

    }

    public function index(Request $request)
    {
        $perPage = $request->per_page;
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);

        return $this->service->records($perPage, $filters, $request->user());
    }

    public function storeBorrowedCheck(Request $request)
    {
        $request->validate([
            "name" => "required| string",
            "reason" => "required| string",
            'check' => 'required| string',
            'id' => 'required'
        ]);
        
        $request->user()->borrowedChecks()->create([
            'check_id' => $request->id,
            'name' => $request->name,
            'reason' => $request->reason,
            'check' => $request->check,
        ]);

        return Redirect::back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

     public function scanCheck(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'check' => 'required| string',
            'status' => 'nullable | string',
        ]);
        $request->user()->checkStatuses()->create([
            'check_id' => $request->id,
            'status' => $request->status,
            'check' => $request->check,
        ]);

        return Redirect::back()->with(['status' => true, 'message' => 'Successfully Scanned']);

    }
}
