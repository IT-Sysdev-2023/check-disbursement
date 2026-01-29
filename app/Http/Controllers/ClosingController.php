<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Helpers\NumberHelper;
use App\Models\CheckStatus;
use App\Services\ClosingService;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function __construct(protected FileHandler $fileHandler, protected ClosingService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }


    public function close(CheckStatus $id)
    {
        return $this->service->close($id);

    }
}
