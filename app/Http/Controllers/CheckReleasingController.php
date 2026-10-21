<?php

namespace App\Http\Controllers;

use App\Exports\ForwardedExport;
use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Http\Resources\BorrowedChequeResource;
use App\Models\BorrowedCheque;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\ReceiverName;
use App\Services\ChequeReleasingService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class CheckReleasingController extends Controller
{

    public function __construct(protected ChequeReleasingService $service, protected FileHandler $fileHandler)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function chequeRegister(Request $request)
    {
        return $this->service->chequeRegistration($request);
    }
    public function chequeRegisterStore(Request $request)
    {
        return $this->service->chequeRegistrationStore($request);
    }

    public function forwardedReleasing(Request $request)
    {
        return $this->service->forwardedReleasing($request);
    }

    public function store(ReleasingCheckRequest $request)
    {
        return $this->service->individualRelease($request);
    }
    public function storeAll(Request $request)
    {
        return $this->service->batchRelease($request);
    }
    public function storeForwarded(Request $request)
    {
        return $this->service->storeForwarded($request);
    }

    public function receiving(Request $request)
    {
        return $this->service->receiving($request);
    }

    public function received(Request $request)
    {
        return $this->service->received($request);
    }

    public function released(Request $request)
    {
        return $this->service->released($request);
    }

    public function cameraCapture(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
        ]);

        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('captures', $filename, 'public');

        // Optionally persist a DB record
        // $capture = Capture::create(['path' => $path, 'user_id' => $request->user()?->id]);

        return response()->json([
            'url' => asset('storage/' . $filename),
            'path' => $path,
        ], 201);
    }

    public function storeReceiverName(Request $request)
    {
        $validated = $request->validate([
            'name' => 'string|required'
        ]);
        $response = ReceiverName::firstOrCreate(['name' => $validated['name']]);

        $isSuccess = $response->wasRecentlyCreated;

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Saved' : 'Already Saved!']);
    }

    public function chequesToRelease(Request $request)
    {
        $records = BorrowedCheque::with('checkable')
            ->whereRelation('scannedRecord', 'batch_reference', $request->batchReference)
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereNotIn('tag_location_id', [1, 2])) // exclude Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->get();
        return response()->json(BorrowedChequeResource::collection($records));
    }

    public function releaseCheque(string $reference)
    {

        $records = BorrowedCheque::with('checkable')
            ->whereRelation('scannedRecord', 'batch_reference', $reference)
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereNotIn('tag_location_id', [1, 2])) // exclude Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        $receiverNames = ReceiverName::select('id', 'name as label')->get();

        return Inertia::render('chequeReleasing/individualCheques', [
            'cheques' => $records,
            'receiversName' => $receiverNames,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);

    }
    public function releaseForwardedCheque(string $reference)
    {

        $records = BorrowedCheque::with('checkable')
            ->whereRelation('scannedRecord', 'batch_reference', $reference)
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->whereIn('tag_location_id', [1, 2])) // exclude Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )
            ->paginate(5)
            ->withQueryString()
            ->toResourceCollection();

        $receiverNames = ReceiverName::select('id', 'name as label')->get();

        return Inertia::render('chequeReleasing/individualCheques', [
            'cheques' => $records,
            'receiversName' => $receiverNames,
            'filter' => (object) [
                'selectedBu' => $filters['bu'] ?? '0',
                'search' => $filters['search'] ?? '',
                'date' => $filters['date'] ?? (object) [
                    'start' => null,
                    'end' => null
                ]
            ],
        ]);

    }

    public function cancelCheck(Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            // 'type' => ['required', 'in:include,exclude'],
            'ids' => [
                'array',
                Rule::requiredIf(fn() => $request->type === 'include'),
            ],
        ]);
        $ids = $request->ids ?? [];

        BorrowedCheque::whereIn(
            'id',
            $ids
        )->chunkById(100, function ($checks) use ($request) {
            foreach ($checks as $check) {
                $check->checkable?->chequeStatus()->create([
                    'status' => 'cancelled',
                    'cancelled_reason' => $request->reason,
                    'caused_by' => $request->user()->id,
                ]);
            }
        });

        return redirect()
            ->route('check-releasing')
            ->with([
                'status' => true,
                'message' => 'Successfully Updated',
            ]);
    }

    private static function getRangeTransaction(string $location)
    {
        $dates = BorrowedCheque::
            whereNot('approver_id', null)

            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $location)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->get()
            ->pluck('checkable.tagged_at');

        $oldestDate = $dates->min();
        $latestDate = $dates->max();

        return $oldestDate && $latestDate
            ? $oldestDate->format('M d, Y') . ' - ' . $latestDate->format('M d, Y')
            : 'No dates available';
    }

    private static function isEmptyRecord($locationId)
    {
        return BorrowedCheque::
            whereNot('approver_id', null)
            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $locationId)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->doesntExist();
    }

    public function generateCebu(Request $request, string $location)
    {

        // $date = now()->format('Ymd_His');
        // $filename = "exports/{$location}/report-{$request->user()->id}-{$date}.xlsx";
        // Excel::store(new ForwardedExport($location), $filename, 'public');

        // return response()->json([
        //     'download_url' => asset("storage/{$filename}"),
        // ]);
        $loc = [
            'cebu' => 1,
            'manila' => 2
        ];
        $locationId = $loc[$location];

        if (self::isEmptyRecord($locationId)) {
            return redirect()->back()->with(['status' => false, 'message' => 'No Records Found']);
        }

        $dateRange = self::getRangeTransaction($locationId);
        $data = BorrowedCheque::
            whereNot('approver_id', null)
            ->has('scannedRecord')
            ->whereHasMorph('checkable', [Cv::class, Crf::class], fn($q) => $q->where('tag_location_id', $locationId)) // Manila and Cebu
            ->whereDoesntHaveMorph(
                'checkable',
                [Cv::class, Crf::class],
                fn($query) => $query->has('chequeStatus')
            )->with('checkable')
            ->get()
            ->map(fn($cheque) => [
                'cv_number' => match (get_class($cheque->checkable)) {
                    Cv::class => $cheque->checkable->cv_no,
                    Crf::class => $cheque->checkable->crf_no,
                },
                'cheque_number' => $cheque->checkable->cheque_number,
                'cheque_date' => $cheque->checkable->cheque_date->format('Y-m-d'),
                'payee' => $cheque->checkable->payee,
                'cheque_amount' => NumberHelper::currency($cheque->checkable->cheque_amount)
            ]);

        $stream = $this->download($dateRange, $location, $data->toArray());

        return redirect()->back()->with(['status' => true, 'stream' => route('pdf.view', ['path' => $stream])]);
        // return redirect()->back()->with(['status' => true, 'stream' => $stream]);
    }

    private function download(string $dateRange, string $location, array $data)
    {

        $data = [
            'title' => 'List of Forwarded Cheques',
            'location' => "($location)",
            'date' => $dateRange,
            'data' => $data
        ];

        return $this->fileHandler
            ->inFolder("exports/{$location}/")
            ->createFileName('report-', auth()->user()->id, '.pdf')
            ->handlePdf($data, 'forwardedReleasingPdf');
    }

}
