<?php

namespace App\Http\Controllers;
use App\Services\CvService;
use Illuminate\Http\Request;

class CvController extends Controller
{
    public function __construct(protected CvService $service ){

    }
    public function index(Request $request)
    {
        $request->validate([
            'start_date' => ['required','date'],
            'end_date' => ['required','date','after_or_equal:start_date'],
            
        ]);
        $date = (object)[
            'start' => $request->start_date,
            'end' => $request->end_date
        ];
        return $this->service->retrieveData($request->user(), $date);
    }

    public function retrieveCv(Request $request){
        $perPage = $request->per_page;
        return $this->service->cvs($perPage);
    }
   
}
