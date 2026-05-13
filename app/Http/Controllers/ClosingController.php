<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Models\ChequeStatus;
use App\Services\ClosingService;
use Illuminate\Http\Request;

class ClosingController extends Controller
{
    public function __construct(protected FileHandler $fileHandler, protected ClosingService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }


    public function close(ChequeStatus $id)
    {
        return $this->service->close($id);

    }
}
