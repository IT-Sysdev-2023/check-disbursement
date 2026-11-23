<?php
namespace App\Services;
use App\Jobs\CrfUploadingJob;
use App\Models\Crf;
use App\Models\Cv;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CrfService
{
    public function index(Request $request)
    {
        $bu = PermissionService::getCompanyPermissions($request->user());
        return Inertia::render('extract/extractCrf', [
            'bu' => $bu
        ]);
    }
    public function extract(Request $request)
    {
        $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120|unique:crfs,filename',
        ]);

        $files = collect($request->file('files'));
        $paths = $files->map(fn($file) => [
            'path' => $file->store('crf-uploads', 'local'),          // storage/app/crf-uploads/...
            'name' => $file->getClientOriginalName(),
        ])->all();

        CrfUploadingJob::dispatch($paths, $request->user()->id);

        return response()->json([
            'status' => true,
            'message' => 'Files received. Processing in the background.',
            'inserted' => $files->count(),
        ], 202);
    }

    public function detailsCrf(Crf $id)
    {
        return Inertia::render('retrievedRecords/checkDetailsCrf', [
            'crf' => $id->load('chequeStatus.chequeForwardedStatus')->toResource()
        ]);
    }
}