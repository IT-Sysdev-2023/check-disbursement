<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Http\Requests\ReleasingCheckRequest;
use App\Http\Resources\BorrowedChequeResource;
use App\Models\BorrowedCheque;
use App\Models\Crf;
use App\Models\Cv;
use App\Models\ReceiverName;
use App\Services\ChequeReleasingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckReleasingController extends Controller
{

    public function __construct(protected ChequeReleasingService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function show(Request $request)
    {
        return $this->service->getReleaseCheck($request->cheques, $request->status);
    }

    public function store(ReleasingCheckRequest $request)
    {
        return $this->service->storeReleaseCheck($request);
    }
    public function storeAll(Request $request)
    {
        return $this->service->storeReleaseCheckAll($request);
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
        $response = ReceiverName::create(['name' => $validated['name']]);

        $isSuccess = $response->wasRecentlyCreated;

        return redirect()->back()->with(['status' => $isSuccess, 'message' => $isSuccess ? 'Successfully Saved' : 'Failed to Save']);
    }

    public function chequesToRelease(Request $request)
    {
        $records = BorrowedCheque::with('checkable')
            ->whereRelation('scannedRecord', 'batch_reference', $request->batchReference)
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



}
