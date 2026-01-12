<?php

namespace App\Http\Controllers;

use App\Helpers\FileHandler;
use App\Helpers\ModelHelper;
use App\Helpers\NumberHelper;
use App\Helpers\StringHelper;
use App\Http\Requests\ReleasingCheckRequest;
use App\Models\CheckForwardedStatus;
use App\Models\CheckStatus;
use App\Models\Crf;
use App\Models\CvCheckPayment;
use App\Services\ForwardedCheckService;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ForwardedCheckController extends Controller
{
    public function __construct(protected ForwardedCheckService $service)
    {
    }
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    public function cancelForwarded(CheckStatus $id, Request $request)
    {
        return $this->service->cancelForwarded($id, $request);
    }
    public function update(CheckStatus $id, Request $request)
    {
        return $this->service->update($id, $request);
    }

    public function showForwarded(string $id, string $status)
    {
        return $this->service->showForwarded($id, $status);
    }

    public function storeReleaseCheck(CheckStatus $id, Request $request)
    {
        return $this->service->storeReleaseCheck($id, $request);
    }

    public function forwardedReleasing(Request $request)
    {
        return $this->service->forwardedReleasing($request);
    }



}
