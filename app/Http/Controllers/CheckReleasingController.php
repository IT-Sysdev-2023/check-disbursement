<?php

namespace App\Http\Controllers;

use App\Models\CancelledCheck;
use App\Models\CheckStatus;
use App\Models\Company;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ReleasedCheck;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckReleasingController extends Controller
{
    public function checkReleasing(Request $request)
    {
        $filters = $request->only(['bu', 'search']);
        $records = CvCheckPayment::with('cvHeader', 'borrowedCheck', 'checkStatus', 'company')
            ->select('id', 'cv_header_id', 'check_number', 'check_date', 'check_amount', 'payee', 'company_id')
            ->whereRelation('checkStatus', 'status', null)
            ->filter($filters)
            ->paginate($request->page)
            ->withQueryString()
            ->toResourceCollection();

        $crfs = Crf::with('borrowedCheck', 'checkStatus')
            ->select('id', 'crf', 'paid_to', 'amount', 'ck_no', 'no', 'company', 'paid_to')
            ->whereRelation('checkStatus', 'status', null)
            ->filter($filters)
            ->paginate($request->page)
            ->withQueryString()
            ->toResourceCollection();

        return Inertia::render('checkReleasing', [
            'cv' => $records,
            'crf' => $crfs
        ]);
    }

    public function releaseCheck(string $id, string $status)
    {
        return Inertia::render('checkReleasing/releaseCheck', [
            'id' => $id,
            'status' => $status,
            'label' => Str::title($status) . ' Check',
        ]);
    }

    public function storeReleaseCheck(CheckStatus $id, Request $request)
    {
        $request->validate(rules: [
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
            'status' => 'required|string',
        ]);

        $signature = preg_replace('/^data:image\/\w+;base64,/', '', $request->signature);

        $imageData = base64_decode($signature);
        $name = $id->id . '_' . $request->user()->id . '_' . now()->format('Y-m-d-His');
        $folder = $request->status . "/";

        Storage::disk('public')->put($folder . 'signatures/' . $name . '.png', $imageData);
        Storage::disk('public')->putFileAs($folder . 'images/', $request->file, $name . '.png');

        $id->update([
            'status' => $request->status,
            'receivers_name' => $request->receiversName,
            'image' => $folder . 'images/' . $name,
            'signature' => $folder . 'signatures/' . $name,
            'caused_by' => $request->user()->id,
        ]);

        return redirect()->route('check-releasing')->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public function cancelCheck(CheckStatus $id, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($id, $request) {

            $id->update([
                'status' => 'cancel',
            ]);

            CancelledCheck::create([
                'check_status_id' => $id->id,
                'reason' => $request->reason,
                'cancelled_by' => $request->user()->id,
            ]);
        });
        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}
