<?php

namespace App\Services;

use App\Http\Resources\CvCheckPaymentResource;
use App\Models\AssignedCheckNumber;
use App\Models\CvCheckPayment;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignedCheckNumberService
{
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

        AssignedCheckNumber::updateOrCreate([
            'cv_check_payment_id' => $request->id,
            'check_number' => $request->checkNumber,
            'caused_by' => $request->user()->id
        ]);

        return Redirect::route('retrievedRecords', ['tab' => 'tableView'])->with(['status' => true, 'message' => 'Successfully Assigned']);
    }
}