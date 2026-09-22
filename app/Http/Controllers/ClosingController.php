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

    public function submitDocuments(Request $request)
    {
        $request->validate([
            'chequeNumber' => 'required',
            'id' => 'required'
        ]);

        return $this->service->documents($request->chequeNumber, $request->id);
    }

    public function scannedDocuments()
    {
        return $this->service->scannedDocuments();
    }
    public function documentImages(Request $request)
    {
        return $this->service->documentImages($request->id, $request->chequeNumber);
    }

    public function document($id, $chequeNumber, $filename){
        return $this->service->document($id, $chequeNumber, $filename);
    }
}
