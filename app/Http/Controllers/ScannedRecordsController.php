<?php

namespace App\Http\Controllers;

use App\Events\ScanningChequesEvent;
use App\Http\Resources\ScannedRecordResource;
use App\Jobs\ProcessChequeJob;
use App\Models\BorrowedCheque;
use App\Models\ScannedRecords;
use App\Services\ScannedRecordsService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
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
    // public function scan(Request $request)
    // {
    //     $path = '\\\\172.16.42.91\\';
    //     // dd($path);
    //     $files = File::files($path);
    //     dd($files);
    //     return inertia('scanCheque/scanCheques');
    // }

    public function scan(Request $request)
    {
        $disk = Storage::disk('cheque_share');

        $files = $disk->files('new');

        $fileData = collect($files)->map(function ($file) use ($disk) {
            return [
                'name' => basename($file),
                'path' => $file,
                'size' => $disk->size($file),
                'last_modified' => $disk->lastModified($file),
            ];
        })->values();

        $data = [];

        for ($i = 0; $i < count($fileData); $i += 2) {
            $data[] = $fileData[$i];
        }

        return inertia('scanCheque/scanCheques', [
            'files' => $data,
        ]);
    }

    public function scanAnalyze()
    {
        $disk = Storage::disk('cheque_share');

        //Get Cheque front scanned only
        $filteredFiles = collect($disk->files('new'))
            ->filter(fn($file) => str_ends_with(strtoupper(pathinfo($file, PATHINFO_FILENAME)), 'F'))
            ->values();

        $count = 0;
        $totalBatches = $filteredFiles->count();
        $filteredFiles->each(function ($item) use (&$count, $totalBatches) {
            
            $count++;
            ProcessChequeJob::dispatch(
                $item,
                Auth::user()->id,
                $count,
                $totalBatches
            );
            ScanningChequesEvent::dispatch(
                'Scanning cheques please wait...',
                $count,
                $totalBatches, 
                Auth::user()
            );   
        });

        return response()->json([
            'status' => 'success',
            // 'records' => $files
        ]);
    }

    public function getScannedCheques(Request $request)
    {

        $data = ScannedRecords::when(isset($request->search), function ($query) use ($request) {
            $query->where('cheque_no', 'like', "%{$request->search}%")
                ->orWhere('account_number', 'like', "%{$request->search}%")
                ->orWhere('bank_account_name', 'like', "%{$request->search}%")
                ->orWhere('amount', 'like', "%{$request->search}%")
                ->orWhere('payee', 'like', "%{$request->search}%");
        })->whereDate('created_at', $request->date)
            ->get();

        return response()->json([
            'records' => $data,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function getScannedRecords(ScannedRecords $id)
    {
        return response()->json(new ScannedRecordResource($id));
    }

    public function putSelectedRowCheck(Request $request)
    {
        $selectedRow = $request->data;

        $record = ScannedRecords::find($selectedRow['id']);

        if (!$record) {
            return response()->json([
                'message' => 'Record not found.'
            ], 404);
        }

        $record->update([
            'bank_account_name' => $selectedRow['bank_account_name'],
            'bu' => $selectedRow['bu'],
            'cheque_no' => $selectedRow['cheque_no'],
            'account_number' => $selectedRow['account_number'],
            'branch_name' => $selectedRow['branch_name'],
            'amount' => $selectedRow['amount'],
            'payee' => $selectedRow['payee'],
            'cheque_date' => $selectedRow['cheque_date'],
        ]);

        return response()->json([
            'record' => $record,
        ]);
    }

    public function clearCache()
    {
        $disk = Storage::disk('cheque_share');
        $files = $disk->files('new');

        foreach ($files as $file) {
            $filename = basename($file);

            $disk->move($file, "scanned/{$filename}");
        }

        return response()->json([
            'status' => 'success'
        ]);
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

        if ($cheque->payee !== $validated['payee']) {
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

    // public function scan(){

    // }

}
