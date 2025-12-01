<?php

namespace App\Http\Controllers;
use App\Events\CvProgress;
use App\Models\BorrowedCheck;
use App\Models\Company;
use App\Models\Cv;
use App\Models\CvCheckPayment;
use App\Services\CvService;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CvController extends Controller
{
    public function __construct(protected CvService $service)
    {

    }

    public function index(Request $request)
    {

        $bu = PermissionService::getCompanyPermissions($request->user());
        return Inertia::render('extract/checkVoucher', [
            'bu' => $bu
        ]);
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
        $perPage = $request->per_page;
        $filters = $request->only(['bu', 'search','sort', 'date']);
        // dd($filters);
        return $this->service->cvs($perPage, $filters, $request->user());
    }

    public function details(CvCheckPayment $id)
    {
        return $this->service->details($id);
    }

}
