<?php

namespace App\Http\Controllers;

use App\Helpers\NumberHelper;
use App\Http\Resources\CvCheckPaymentResource;
use App\Models\Approver;
use App\Models\AssignedCheckNumber;
use App\Models\BorrowedCheck;
use App\Models\BorrowerName;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Models\TagLocation;
use App\Services\ChecksService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RetrievedChecksController extends Controller
{

    public function __construct(protected ChecksService $service)
    {

    }

    public function index(Request $request)
    {
        $perPage = $request->per_page;
        $filters = $request->only(['bu', 'search', 'sort', 'date', 'selectedCheck', 'tab']);

        return $this->service->records($perPage, $filters, $request);
    }

    public function storeBorrowedCheck(Request $request)
    {
        $request->validate([
            "name" => "required| string",
            "reason" => "required| string",
            'check' => 'required| string',
            'id' => 'required'
        ]);

        $request->user()->borrowedChecks()->create([
            'check_id' => $request->id,
            'name' => $request->name,
            'reason' => $request->reason,
            'check' => $request->check,
        ]);

        return Redirect::back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }

    public function storeBorrowCheck(Request $request)
    {
        $request->validate([
            "type" => ["required", 'in:include,exclude'],
            "ids" => ['required_if:type,include', 'array'],
            'ids.*' => ['integer'],
            "name" => ["required", "int"],
            "reason" => ["required", "string"],
            'check' => ["required", "in:cv,crf"],
        ]);

        if (!self::checkIds($request->check, $request->ids)) {
             return redirect()->back()->with(['status' => false, 'message' => 'Some selected checks have no location assigned. Please assign location before borrowing.']);
           
        }

        $borrowerNo = (BorrowedCheck::max('borrower_no') ?? 0) + 1;
        if ($request->type === 'exclude') {
            if ($request->check === 'cv') {
                CvCheckPayment::doesntHave('borrowedCheck')
                    ->doesntHave('checkStatus')
                    ->where(function ($q) {
                        $q->where('check_number', '!=', 0)
                            ->orHas('assignedCheckNumber');
                    })
                    ->whereNotIn('id', $request->ids)
                    ->chunk(100, function (Collection $items) use ($request, $borrowerNo) {
                        $data = $items->map(fn($check) => [
                            'check_id' => $check->id,
                            'borrower_no' => $borrowerNo,
                            'borrower_name_id' => $request->name,
                            'reason' => $request->reason,
                            'check' => $request->check,
                            'user_id' => $request->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            } else {
                Crf::doesntHave('checkStatus')
                    ->doesntHave('borrowedCheck')
                    ->whereNotIn('id', $request->ids)
                    ->chunk(100, function (Collection $items) use ($request, $borrowerNo) {
                        $data = $items->map(fn($check) => [
                            'check_id' => $check->id,
                            'borrower_no' => $borrowerNo,
                            'borrower_name_id' => $request->name,
                            'reason' => $request->reason,
                            'check' => $request->check,
                            'user_id' => $request->user()->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ])->toArray();

                        BorrowedCheck::insert($data);
                    });
            }
        } else {
            foreach ($request->ids as $id) {
                $request->user()->borrowedChecks()->create([
                    'check_id' => $id,
                    'borrower_no' => $borrowerNo,
                    'borrower_name_id' => $request->name,
                    'reason' => $request->reason,
                    'check' => $request->check,
                ]);
            }
        }

        return $this->download($borrowerNo, $request->check);
    }

    private function checkIds($check, $ids)
    {
        $model = $check === 'cv' ? CvCheckPayment::class : Crf::class;

        return $model::whereIn('id', $ids)
            ->whereNull('tag_location_id')
            ->count() === 0;
    }

    // public function scanCheck(Request $request)
    // {
    //     $request->validate([
    //         'id' => 'required',
    //         'check' => 'required| string',
    //         'status' => 'nullable | string',
    //     ]);
    //     $request->user()->checkStatuses()->create([
    //         'check_id' => $request->id,
    //         'status' => $request->status,
    //         'check' => $request->check,
    //     ]);

    //     return Redirect::back()->with(['status' => true, 'message' => 'Successfully Scanned']);
    // }
    public function unassignCheck(CvCheckPayment $id)
    {
        return Inertia::render('retrievedRecords/unassignCheck', [
            'cv' => new CvCheckPaymentResource($id->load('cvHeader:id,cv_no,vendor_no,remarks'))
        ]);
    }

    public function storeUnassignCheck(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'checkNumber' => ['required', 'integer', 'regex:/^[1-9]\d*$/'],
        ]);

        AssignedCheckNumber::updateOrCreate([
            'cv_check_payment_id' => $request->id,
            'check_number' => $request->checkNumber,
            'caused_by' => $request->user()->id
        ]);

        return Redirect::route('retrievedRecords', ['tab' => 'tableView'])->with(['status' => true, 'message' => 'Successfully Assigned']);
    }

    public function borrowerNames(Request $request)
    {
        $names = BorrowerName::select('id', 'name')->get();

        $transform = $names->map(function ($name) {
            return [
                'label' => $name->name,
                'value' => $name->id,
            ];
        });

        return response()->json($transform);
    }
    public function download(int $borrowerNo, string $check)
    {
        $borrower = BorrowedCheck::with('borrowerName:id,name')
            ->with($check === 'cv' ? 'cvCheckPayment.company' : 'crf')
            ->where('borrower_no', $borrowerNo)
            ->get();

        $companyNames = $borrower
            ->pluck($check === 'cv' ? 'cvCheckPayment.company.name' : 'crf.company')
            ->filter()
            ->unique()
            ->implode(', ');

        $data = [
            'dateBorrowed' => $borrower->first()->created_at->isoFormat('MMMM D, YYYY h:mm A'),
            'items' => [
                [
                    'borrowerNo' => NumberHelper::padLeft($borrowerNo),
                    'noOfChecks' => $borrower->count(),
                    'borrowedBy' => $borrower->first()->borrowerName?->name,
                    'company' => $companyNames,
                    'purpose' => 'For Signature',
                ]
            ]
        ];

        $pdf = Pdf::loadView('borrowedPdf', ['data' => $data])->setPaper('A5');

        // Get raw PDF output
        $output = $pdf->output();

        // Define a filename
        $filename = 'pdfs/borrowed/' . $borrowerNo . '_' . now()->format('Ymd_His') . '.pdf';

        // Store in storage/app/public (or any disk you prefer)
        Storage::disk('public')->put($filename, $output);

        // Encode in Base64
        $base64 = base64_encode($output);

        // Optional: add header for embedding
        $stream = "data:application/pdf;base64," . $base64;

        return redirect()->back()->with(['status' => true, 'stream' => $stream]);
    }

    public function borrowedChecks(Request $request)
    {
        $ids = BorrowedCheck::where('borrower_no', $request->borrowerNo)->pluck('check_id');
        if ($request->check === 'cv') {
            $records = CvCheckPayment::with('cvHeader', 'company')
                ->select('check_date', 'check_amount', 'cv_check_payments.id', 'cv_header_id', 'companies.name as company_name', 'payee')
                ->join('companies', 'companies.id', '=', 'cv_check_payments.company_id')
                ->whereIn('cv_check_payments.id', $ids)
                ->get()
                ->each(function ($item) {
                    $item->date = $item->check_date->toFormattedDateString();
                    $item->check_amount = NumberHelper::currency($item->check_amount);
                });
        } else {
            $records = Crf::select('id', 'crf', 'company', 'no', 'paid_to', 'particulars', 'amount', 'ck_no', 'prepared_by')
                ->whereIn('id', $ids)
                ->get();
        }
        return response()->json($records);
    }

    public function approver(Request $request)
    {
        $names = Approver::select('id', 'name')->get();

        $transform = $names->map(function ($name) {
            return [
                'label' => $name->name,
                'value' => $name->id,
            ];
        });

        return response()->json($transform);
    }

    public function approveCheck(Request $request)
    {
        $request->validate([
            'borrowedNo' => ['required', 'integer'],
            'approver' => ['required', 'integer'],
        ]);
        BorrowedCheck::where('borrower_no', $request->borrowedNo)
            ->update(['approved_at' => Date::now(), 'approver_id' => $request->approver]);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Approved']);
    }

    public function getLocation()
    {
        $names = TagLocation::select('id', 'location')->get();

        $transform = $names->map(function ($name) {
            return [
                'label' => $name->location,
                'value' => $name->id,
            ];
        });

        return response()->json($transform);
    }

    public function setLocation(Request $request)
    {
        $request->validate([
            'checkId' => ['required', 'integer'],
            'locationId' => ['required', 'integer'],
            'check' => ['required', 'string'],
        ]);

        if ($request->check === 'cv') {
            CvCheckPayment::where('id', $request->checkId)
                ->update(['tag_location_id' => $request->locationId, 'tagged_at' => now()]);
        }

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Tagged']);
    }
}
