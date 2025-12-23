<?php

namespace App\Http\Controllers;

use App\Models\CancelledCheck;
use App\Models\CheckStatus;
use App\Models\Company;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\ReleasedCheck;
use App\Services\PermissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckReleasingController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck']);
        $records = CvCheckPayment::with('cvHeader', 'checkStatus', 'company')
            ->withWhereHas('borrowedCheck', function ($query) {
                $query->whereNotNull('approver_id');
            })
            ->select('id', 'cv_header_id', 'check_number', 'check_date', 'check_amount', 'payee', 'company_id')
            ->whereRelation('checkStatus', 'status', null)
            ->filter($filters)
            ->paginate($request->page)
            ->withQueryString()
            ->toResourceCollection();

        // $checks = CvCheckPayment::withWhereHas('borrowedCheck', function ($query) {
        //     $query->with('approver:id,name')->whereNotNull('approver_id');
        // })
        //     ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
        //     ->leftJoin('scanned_records', function ($join) {
        //         $join->on('scanned_records.check_no', '=', 'assigned_check_numbers.check_number')
        //             ->on('scanned_records.amount', '=', 'cv_check_payments.check_amount');
        //     })

        //     ->select(
        //         'cv_check_payments.id',
        //         'cv_check_payments.check_number',
        //         'cv_check_payments.payee',
        //         'cv_check_payments.cv_header_id',
        //         'cv_check_payments.company_id',

        //         'scanned_records.id as scanned_id',
        //     )
        //     ->with('company:id,name', 'cvHeader:id,cv_date,cv_no')
        //     ->paginate(5)
        //     ->withQueryString()
        //     ->toResourceCollection();

        $crfs = ($filters['selectedCheck'] ?? null) === 'cv'
            ? Inertia::lazy(fn() =>
                self::crfRecords($filters, $request->page))
            : self::crfRecords($filters, $request->page);

        return Inertia::render('checkReleasing', [
            'cv' => $records,
            'crf' => $crfs,
            'defaultCheck' => $filters['selectedCheck'] ?? 'cv',
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
            'company' => PermissionService::getCompanyPermissions($request->user())->prepend([
                'label' => 'All',
                'value' => '0'
            ]),
        ]);
    }

    private function crfRecords(?array $filters, ?int $page)
    {
        return Crf::with('borrowedCheck', 'checkStatus')
            ->select('id', 'crf', 'paid_to', 'amount', 'ck_no', 'no', 'company', 'paid_to')
            ->whereRelation('checkStatus', 'status', null)
            ->filter($filters)
            ->paginate($page)
            ->withQueryString()
            ->toResourceCollection();
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
