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
        $defaultCheck = $filters['selectedCheck'] ?? 'cv';

        $chequeRecords = self::chequeRecords($filters, $defaultCheck);

        return Inertia::render('checkReleasing', [
            'cheques' => $chequeRecords,
            'defaultCheck' => $defaultCheck,
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

    private static function chequeRecords(array $filters, string $defaultCheck)
    {
        $loader = $defaultCheck === 'cv'
            ? fn() => self::cvRecords($filters)
            : fn() => self::crfRecords($filters);

        return $loader();
    }

    private static function cvRecords(?array $filters)
    {
        return CvCheckPayment::with('cvHeader', 'company')
            ->withWhereHas('borrowedCheck', function ($query) {
                $query->whereNotNull('approver_id');
            })
            ->doesntHave('checkStatus')
            ->leftJoin('assigned_check_numbers', 'assigned_check_numbers.cv_check_payment_id', '=', 'cv_check_payments.id')
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.amount', '=', 'cv_check_payments.check_amount')
                    ->where(function ($q) {
                        $q->where(function ($q) {
                            $q->where('cv_check_payments.check_number', '!=', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'cv_check_payments.check_number'
                                );
                        })->orWhere(function ($q) {
                            $q->where('cv_check_payments.check_number', 0)
                                ->whereColumn(
                                    'scanned_records.check_no',
                                    'assigned_check_numbers.check_number'
                                );
                        });
                    });
            })
            ->select(
                'cv_check_payments.id',
                'cv_check_payments.cv_header_id',
                'cv_check_payments.check_number',
                'cv_check_payments.check_date',
                'cv_check_payments.check_amount',
                'cv_check_payments.payee',
                'cv_check_payments.company_id',
                'cv_check_payments.tag_location_id'
            )
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    private static function crfRecords(?array $filters)
    {
        return Crf::select('crfs.id', 'crf', 'paid_to', 'crfs.amount', 'ck_no', 'no', 'company', 'paid_to','tag_location_id')
            ->withWhereHas('borrowedCheck', function ($query) {
                $query->whereNotNull('approver_id');
            })
            ->doesntHave('checkStatus')
            ->join('scanned_records', function ($join) {
                $join->on('scanned_records.check_no', '=', 'crfs.ck_no')
                    ->on('scanned_records.amount', '=', 'crfs.amount');
            })
            ->filter($filters)
            ->paginate(10)
            ->withQueryString()
            ->toResourceCollection();
    }

    public function releaseCheck(string $checkId, string $status, string $check)
    {
        return Inertia::render('checkReleasing/releaseCheck', [
            'checkId' => $checkId,
            'status' => $status,
            'check' => $check,
            'label' => Str::title($status) . ' Check'
        ]);
    }

    public function storeReleaseCheck(Request $request)
    {
        $request->validate(rules: [
            'receiversName' => 'required|string|max:255',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'signature' => 'required|string',
            'status' => 'required|string',
            'id' => 'required|string',
            'check' => 'required|string'
        ]);

        $signature = preg_replace('/^data:image\/\w+;base64,/', '', $request->signature);

        $imageData = base64_decode($signature);
        $name = $request->id . '_' . $request->user()->id . '_' . now()->format('Y-m-d-His');
        $folder = $request->status . "/";

        Storage::disk('public')->put($folder . 'signatures/' . $name . '.png', $imageData);
        Storage::disk('public')->putFileAs($folder . 'images/', $request->file, $name . '.png');

        CheckStatus::create([
            'check_id' => $request->id,
            'status' => Str::lower($request->status),
            'check' => $request->check,
            'receivers_name' => $request->receiversName,
            'image' => $folder . 'images/' . $name,
            'signature' => $folder . 'signatures/' . $name,
            'caused_by' => $request->user()->id,
        ]);

        return redirect()->route('check-releasing')->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public function cancelCheck(int $id, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'check' => 'required|string'
        ]);

        DB::transaction(function () use ($id, $request) {

            CheckStatus::create([
                'check_id' => $id,
                'check' => $request->check,
                'status' => 'cancel',
                'cancelled_reason' => $request->reason,
                'caused_by' => $request->user()->id,
            ]);
        });
        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}
