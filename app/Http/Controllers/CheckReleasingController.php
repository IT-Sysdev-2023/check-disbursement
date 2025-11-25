<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ReleasedCheck;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CheckReleasingController extends Controller
{
    public function checkReleasing(Request $request)
    {
        $query = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'scannedCheck', 'company')
            ->select('id', 'cv_header_id', 'check_number', 'check_date', 'check_amount', 'payee', 'company_id')
            ->has('scannedCheck')
            ->doesntHave('releasedCheck')
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
            ->doesntHave('releasedCheck')
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

    public function releaseCheck(int $id)
    {
        return Inertia::render('checkReleasing/releaseCheck', [
            'id' => $id
        ]);
    }

    public function storeReleaseCheck(Request $request)
    {
        $request->validate([
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
            'id' => 'required|integer'
        ]);

        $signature = preg_replace('/^data:image\/\w+;base64,/', '', $request->signature);

        $imageData = base64_decode($signature);
        $name = $request->id . '_' . $request->user()->id . '_' . now()->format('Y-m-d-His');
        $folder = "releasedChecks/";

        Storage::disk('public')->put($folder . 'signatures/' . $name . '.png', $imageData);
        Storage::disk('public')->putFileAs($folder . 'images/', $request->file, $name . '.png');

        $request->user()->releasedChecks()->create([
            'check_id' => $request->id,
            'receivers_name' => $request->receiversName,
            'image' => $folder . 'images/' . $name,
            'signature' => $folder . 'signatures/' . $name,
        ]);

        return redirect()->route('check-releasing')->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}
