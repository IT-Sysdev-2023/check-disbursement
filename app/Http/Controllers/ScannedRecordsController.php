<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScannedRecordResource;
use App\Models\BorrowedCheque;
use App\Models\ScannedRecords;
use App\Services\ScannedRecordsService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

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

    public function store(BorrowedCheque $id, Request $request)
    { 
        $validated = $request->validate([
            "accountNumber" => "required",
            "chequeNumber" => "required | string",
            "chequeDate" => "required | date",
            "payee" => "required | string",
            "amount" => 'required | numeric | gt:0'
        ]);

        $cheque = $id->load('checkable')->checkable;

        $dbChequeNo = $cheque->cheque_number ?: $cheque->resolved_cheque_number;

        $dbChequeDate = $cheque->cheque_date ?: $cheque->resolved_cheque_date;
        $dbAmount = $id->checkable_type == 'crf' ? $cheque->amount : $cheque->cheque_amount;
        $payee = $id->checkable_type == 'crf' ? $cheque->paid_to : $cheque->payee;

        // Normalize before comparison
        if ((string) $dbChequeNo !== (string) $validated['chequeNumber']) {
            throw ValidationException::withMessages([
                'chequeNumber' => 'Cheque number mismatch.',
            ]);
        }

        if (!$dbChequeDate->isSameDay(Date::parse($validated['chequeDate']))) {
            throw ValidationException::withMessages([
                'chequeDate' => 'Cheque Date mismatch.',
            ]);
        }

        if ((float) $dbAmount !== (float) $validated['amount']) {
            throw ValidationException::withMessages([
                'amount' => 'Cheque amount mismatch.',
            ]);
        }
        
        if ( $payee !== $validated['payee']) {
            throw ValidationException::withMessages([
                'payee' => 'Payee mismatch.',
            ]);
        }

        ScannedRecords::create([
            'bank_account_id' => $request->accountNumber,
            'cheque_no' => $request->chequeNumber,
            'cheque_date' => $request->chequeDate,
            'payee' => $request->payee,
            'amount' => $request->amount,
            'caused_by' => $request->user()->id
        ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Submitted']);

    }

}
