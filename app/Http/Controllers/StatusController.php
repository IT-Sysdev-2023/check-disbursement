<?php

namespace App\Http\Controllers;

use App\Models\BorrowedCheck;
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

        $query = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'scannedCheck')
            ->has('scannedCheck')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('cvHeader', function (Builder $query) use ($search) {
                    $query->whereAny([
                        'cv_no',
                    ], 'LIKE', '%' . $search . '%');
                });
            });

        // if ($bu) {
        //     $query->whereRelation(
        //         'cvHeader.navHeaderTable.navDatabase',
        //         'company',
        //         $bu
        //     );
        // }

        $records = $query->paginate($request->page)->withQueryString();

        $crfs = Crf::with('borrowedCheck', 'scannedCheck')
            ->has('scannedCheck')
            ->when($request->search, function ($query, $search) {
                $query->whereAny([
                    'crf',
                ], 'LIKE', '%' . $search . '%');
            })->paginate($request->page);

        return Inertia::render('checkStatus', [
            'cv' => $records,
            'crf' => $crfs
        ]);
    }

    public function checkReleasing(Request $request)
    {
        $query = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'scannedCheck')
            ->has('scannedCheck')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('cvHeader', function (Builder $query) use ($search) {
                    $query->whereAny([
                        'cv_no',
                    ], 'LIKE', '%' . $search . '%');
                });
            });

        // if ($bu) {
        //     $query->whereRelation(
        //         'cvHeader.navHeaderTable.navDatabase',
        //         'company',
        //         $bu
        //     );
        // }

        $records = $query->paginate($request->page)->withQueryString();

        $crfs = Crf::with('borrowedCheck', 'scannedCheck')
            ->has('scannedCheck')
            ->when($request->search, function ($query, $search) {
                $query->whereAny([
                    'crf',
                ], 'LIKE', '%' . $search . '%');
            })->paginate($request->page);

        return Inertia::render('checkReleasing', [
            'cv' => $records,
            'crf' => $crfs
        ]);
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
