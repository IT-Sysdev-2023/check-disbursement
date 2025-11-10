<?php

namespace App\Http\Controllers;

use App\Services\CrfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CrfController extends Controller
{

    public function __construct(protected CrfService $service){

    }
    public function index()
    {
        return Inertia::render('extract/checkRequestForm');
    }

    public function extractCrf(Request $request)
    {
         $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120|unique:crfs,filename',
        ]);
       return $this->service->extract($request->file('files'));
    }
}
