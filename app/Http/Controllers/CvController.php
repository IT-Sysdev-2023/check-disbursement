<?php

namespace App\Http\Controllers;
use App\Events\CvProgress;
use App\Models\BorrowedCheck;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Services\CvService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CvController extends Controller
{
    public function __construct(protected CvService $service)
    {

    }

    public function index()
    {
        return Inertia::render(component: 'extract/checkVoucher');
    }

    public function extractCv(Request $request)
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'bu' => ['required', 'array', 'min:1']
        ]);
        $date = (object) [
            'start' => $request->start_date,
            'end' => $request->end_date
        ];
        return $this->service->retrieveData($request->user(), $date, $request->bu);
    }

    public function retrievedCv(Request $request)
    {
        // dd(1);

        $perPage = $request->per_page;
        return $this->service->cvs($perPage, $request->bu, $request->search);
    }

    public function details(CvCheckPayment $id)
    {
        return $this->service->details($id);
    }

    public function storeBorrowedCheck(Request $request)
    {
        $request->validate([
            "name" => "required| string",
            "reason" => "required| string",
            'check' => 'required| string',
            'id' => 'required'
        ]);

        BorrowedCheck::create([
            'check_id' => $request->id,
            'name' => $request->name,
            'reason' => $request->reason,
            'check' => $request->check,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return Redirect::back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public function scanCheck()
    {

    }

}
