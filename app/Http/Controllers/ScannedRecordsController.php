<?php

namespace App\Http\Controllers;

use App\Events\ScanProgress;
use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheck;
use App\Models\ScannedRecords;
use App\Services\ScannedRecordsService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ScannedRecordsController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected ScannedRecordsService $service)
    {

    }
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function scan(Request $request)
    {
        return $this->service->scan($request->user()->id);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function getScannedRecords(ScannedRecords $id)
    {
        $record = $id->load('bankAccount.bank');
        return response()->json(new ScannedRecordResource($id));
    }

    public function update(ScannedRecords $id, Request $request)
    {
        return $this->service->update($id, $request);
    }

    public function store(BorrowedCheck $id, Request $request)
    {
        $validated = $request->validate([
            "accountNumber" => "required",
            "checkNumber" => "required | string",
            "checkDate" => "required | date",
            "payee" => "required | string",
            "amount" => 'required | numeric | gt:0'
        ]);

        $check = $id->load('checkable')->checkable;

        $dbCheckNo = $check->check_number ?: $check->resolved_check_number;

        $dbCheckDate = $check->check_date ?: $check->resolved_check_date;
        $dbAmount = $check->check_amount;

        // Normalize before comparison
        if ((string) $dbCheckNo !== (string) $validated['checkNumber']) {
            throw ValidationException::withMessages([
                'checkNumber' => 'Check number mismatch.',
            ]);
        }

        if ((float) $dbAmount !== (float) $validated['amount']) {
            throw ValidationException::withMessages([
                'amount' => 'Check amount mismatch.',
            ]);
        }

        if (!$dbCheckDate->isSameDay(Date::parse($validated['checkDate']))) {
            throw ValidationException::withMessages([
                'checkDate' => 'Check Date mismatch.',
            ]);
        }

        ScannedRecords::create([
            'bank_account_id' => $request->accountNumber,
            'check_no' => $request->checkNumber,
            'check_date' => $request->checkDate,
            'payee' => $request->payee,
            'amount' => $request->amount,
            'caused_by' => $request->user()->id
        ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Submitted']);

    }

}
