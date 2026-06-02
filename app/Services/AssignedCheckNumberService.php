<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;

class AssignedCheckNumberService
{
    public function updateAssignChequeNumber(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'id' => 'required',
            'checkNumber' => ['required', 'integer', 'regex:/^[1-9]\d*$/'],
        ]);
        
        $model = Relation::getMorphedModel($validated['type']);

        $model::findOrFail($validated['id'])->update(['resolved_check_number' => $validated['checkNumber']]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Assigned']);
    }

    public function updateAssignCheckDate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'id' => 'required',
            'chequeDate' => ['required', 'date'],
        ]);

        $model = Relation::getMorphedModel($validated['type']);

        $model::findOrFail($validated['id'])->update(['resolved_cheque_date' => $validated['chequeDate']]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Assigned']);
    }
}