<?php

namespace App\Http\Controllers;
use App\Events\CvProgress;
use App\Models\Cv;
use App\Services\CvService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CvController extends Controller
{
    public function __construct(protected CvService $service)
    {

    }

    public function index()
    {
        return Inertia::render('extract/checkVoucher');
    }
    
    public function extractCv(Request $request)
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'bu' => ['required', 'array', 'min:1']
        ]);
        $date = (object) [
            'start' => $request->start_date,
            'end' => $request->end_date
        ];
        return $this->service->retrieveData($request->user(), $date, $request->bu);
    }

    public function retrievedCv(Request $request)
    {
        // dd(1);
        $perPage = $request->per_page;
        return $this->service->cvs($perPage, $request->bu);
    }

    public function details($id)
    {
        return $this->service->details($id);
    }

}
