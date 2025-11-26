<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\CrfService;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;

class CrfController extends Controller
{

    public function __construct(protected CrfService $service)
    {

    }
    public function index(Request $request)
    {
        $bu = PermissionService::getCompanyPermissions($request->user());
        return Inertia::render('extract/checkRequestForm', [
            'bu' => $bu
        ]);
    }

    public function extractCrf(Request $request)
    {

        $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120|unique:crfs,filename',
            'bu' => ['required', 'array', 'min:1']
        ]);
        return $this->service->extract($request->file('files'), $request->user()->id, $request->bu);
    }

    public function retrievedCrf(Request $request)
    {
        $records = Crf::filter($request->only('search'))->paginate();
        return Inertia::render('retrievedCrf', [
            'crf' => $records
        ]);
    }

    public function detailsCrf(Crf $id)
    {
        return Inertia::render('crf/crfDetails', [
            'crf' => $id->toResource()
        ]);
    }
}
