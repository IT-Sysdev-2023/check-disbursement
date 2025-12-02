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
        $filters = $request->only(['bu', 'search']);
        $records = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'checkStatus')
            ->has('checkStatus')
            ->filter($filters)
            ->paginate($request->page)
            ->withQueryString()
            ->toResourceCollection();

        $crfs = Crf::with('borrowedCheck', 'checkStatus')
            ->has('checkStatus')
            ->filter($filters)
            ->paginate($request->page)
            ->withQueryString()
            ->toResourceCollection();

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
}
