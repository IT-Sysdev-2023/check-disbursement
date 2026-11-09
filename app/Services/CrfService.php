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

    private static function updateCv($crf)
    {
        $cheques = $crf->map(fn($item) => [
            'id' => $item->id,
            'crf_no' => str_replace('#', '', $item->crf_no),
            'payee' => $item->payee,
            'cheque_amount' => $item->cheque_amount,
        ]);

        $crfNo = $cheques->pluck('crf_no')->unique();

        $cvRecords = Cv::whereIn(
            DB::raw("REPLACE(cv_no, '#', '')"),
            $crfNo
        )
            ->get()
            ->keyBy(fn($cv) => str_replace('#', '', $cv->cv_no));

        foreach ($cheques as $cheque) {
            $cv = $cvRecords->get($cheque['crf_no']);
            if (
                $cv &&
                $cv->payee === $cheque['payee'] &&
                (float) $cv->cheque_amount === (float) $cheque['cheque_amount']
            ) {
                $cv->update([
                    'crf_id' => $cheque['id'],
                ]);
            }
        }
    }

    public function detailsCrf(Crf $id)
    {
        return Inertia::render('retrievedRecords/checkDetailsCrf', [
            'crf' => $id->load('chequeStatus.chequeForwardedStatus')->toResource()
        ]);
    }
}