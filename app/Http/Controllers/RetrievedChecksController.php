<?php

namespace App\Http\Controllers;

use App\Http\Resources\CvCheckPaymentResource;
use App\Models\BorrowedCheck;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\ChecksService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RetrievedChecksController extends Controller
{

    public function __construct(protected ChecksService $service)
    {

    }

    public function index(Request $request)
    {
        $perPage = $request->per_page;
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'tab']);

        return $this->service->records($perPage, $filters, $request);
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

    public function storeBorrowCheck(Request $request)
    {
        $request->validate([
            "type" => ["required", 'in:include,exclude'],
            "ids" => ['required_if:type,include', 'array'],
            'ids.*' => ['integer'],
            "name" => ["required", "string"],
            "reason" => ["required", "string"],
            'check' => ["required", "in:cv,crf"],
        ]);

        if ($request->type === 'exclude') {
            if ($request->check === 'cv') {
                CvCheckPayment::doesntHave('borrowedCheck')
                    ->doesntHave('checkStatus')
                    ->where(function ($q) {
                        $q->where('check_number', '!=', 0)
                            ->orHas('assignedCheckNumber');
                    })
                    ->whereNotIn('id', $request->ids)
                    ->chunk(100, function (Collection $items) use ($request) {
                        $data = $items->map(fn($check) => [
                            'check_id' => $check->id,
                            'name' => $request->name,
                            'reason' => $request->reason,
                            'check' => $request->check,
                            'user_id' => $request->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            } else {
                Crf::doesntHave('checkStatus')
                    ->doesntHave('borrowedCheck')
                    ->whereNotIn('id', $request->ids)
                    ->chunk(100, function (Collection $items) use ($request) {
                        $data = $items->map(fn($check) => [
                            'check_id' => $check->id,
                            'name' => $request->name,
                            'reason' => $request->reason,
                            'check' => $request->check,
                            'user_id' => $request->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            }
        } else {
            foreach ($request->ids as $id) {
                $request->user()->borrowedChecks()->create([
                    'check_id' => $id,
                    'name' => $request->name,
                    'reason' => $request->reason,
                    'check' => $request->check,
                ]);
            }
        }


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
    public function unassignCheck(CvCheckPayment $id)
    {
        return Inertia::render('retrievedRecords/unassignCheck', [
            'cv' => new CvCheckPaymentResource($id->load('cvHeader:id,cv_no,vendor_no,remarks'))
        ]);
    }

    public function storeUnassignCheck(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'checkNumber' => ['required', 'integer', 'regex:/^[1-9]\d*$/'],
        ]);

        $request->user()->assignedCheckNumber()->create([
            'cv_check_payment_id' => $request->id,
            'check_number' => $request->checkNumber
        ]);

        return Redirect::route('retrievedRecords', ['tab' => 'cv'])->with(['status' => true, 'message' => 'Successfully Assigned']);
    }
}
