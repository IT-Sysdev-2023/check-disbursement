<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckReleasingController extends Controller
{
    public function checkReleasing(Request $request)
    {
        $query = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'scannedCheck', 'company')
            ->select('id', 'cv_header_id', 'check_number', 'check_date', 'check_amount', 'payee', 'company_id')
            ->has('scannedCheck')
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
                'company_id',
                $request->bu
            );
        }

        $crfs = Crf::with('borrowedCheck', 'scannedCheck')
            ->select('id', 'crf', 'paid_to', 'amount', 'ck_no', 'no', 'company', 'paid_to')
            ->has('scannedCheck')
            ->when($request->search, function ($query, $search) {
                $query->whereAny([
                    'crf',
                ], 'LIKE', '%' . $search . '%');
            })
            ->paginate($request->page)
            ->withQueryString();

        return Inertia::render('checkReleasing', [
            'cv' => $query->paginate($request->page)->withQueryString()->toResourceCollection(),
            'crf' => $crfs->toResourceCollection()
        ]);
    }

    public function releaseCheck(CvCheckPayment $id)
    {
        return Inertia::render('checkReleasing/releaseCheck', [
            'check' => $id->load('cvHeader', 'scannedCheck', 'borrowedCheck', 'company')
        ]);
    }

    public function storeReleaseCheck(Request $request)
    {
        $request->validate([
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
        ]);
        dd(1);
        // Process the data as needed, e.g., save to database, handle file upload, etc.

        // return redirect()->route('check-releasing')->with('message', 'Check released successfully!')->with('status', 'success');
    }
}
