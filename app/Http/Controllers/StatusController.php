<?php

namespace App\Http\Controllers;

use App\Http\Resources\CvCheckPaymentCollection;
use App\Models\BorrowedCheck;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Database\Query\Builder;
use Inertia\Inertia;

class StatusController extends Controller
{

    public function checkStatus(Request $request)
    {

        $query = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'checkStatus')
            ->has('checkStatus')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('cvHeader', function (Builder $query) use ($search) {
                    $query->whereAny([
                        'cv_no',
                    ], 'LIKE', '%' . $search . '%');
                });
            });

        if ($request->bu) {
            $query->whereRelation(
                'cvHeader.navHeaderTable.navDatabase',
                'company',
                $request->bu
            );
        }

        $records = $query->paginate($request->page)->withQueryString()->toResourceCollection();

        $crfs = Crf::with('borrowedCheck', 'checkStatus')
            ->has('checkStatus')
            ->when($request->search, function ($query, $search) {
                $query->whereAny([
                    'crf',
                ], 'LIKE', '%' . $search . '%');
            })->paginate($request->page)->withQueryString()->toResourceCollection();

        return Inertia::render('checkStatus', [
            'cv' => $records,
            'crf' => $crfs
        ]);
    }

    public function updateStatus(CheckStatus $id, Request $request)
    {

        $request->validate([
            'value' => 'required | string'
        ]);

        $id->update([
            'status' => $request->value
        ]);

        return Redirect::back()->with(['status' => true, 'message' => 'Successfully Updated']);
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
