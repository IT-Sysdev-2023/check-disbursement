<?php

namespace App\Services;

use App\Http\Resources\CvCheckPaymentResource;
use App\Models\AssignedCheckNumber;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignedCheckNumberService
{
    public function updateAssignCheckNumber(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'id' => 'required',
            'checkNumber' => ['required', 'integer', 'regex:/^[1-9]\d*$/'],
        ]);
        $model = Relation::getMorphedModel($validated['type']);

        $model::findOrFail($validated['id'])->update(['resolved_check_number' => $validated['checkNumber']]);

        return Redirect::route('retrievedRecords', ['tab' => 'tableView'])->with(['status' => true, 'message' => 'Successfully Assigned']);
    }

    public function updateAssignCheckDate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'id' => 'required',
            'checkDate' => ['required', 'date'],
        ]);
        
        $model = Relation::getMorphedModel($validated['type']);

        $model::findOrFail($validated['id'])->update(['resolved_check_date' => $validated['checkDate']]);

        return Redirect::route('retrievedRecords', ['tab' => 'tableView'])->with(['status' => true, 'message' => 'Successfully Assigned']);
    }
}