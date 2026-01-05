<?php

namespace App\Services;
use App\Events\CrfProgress;
use App\Helpers\CrfHelper;
use App\Models\Crf;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CrfService
{
    public function index(Request $request)
    {
        $bu = PermissionService::getCompanyPermissions($request->user());
        return Inertia::render('extract/checkRequestForm', [
            'bu' => $bu
        ]);
    }
    public function extract(Request $request)
    {
        $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120|unique:crfs,filename',
            'bu' => ['required', 'array', 'min:1']
        ]);

        $userId = $request->user()->id;
        $records = collect();

        $files = collect($request->file('files'));
        $total = $files->count();
        $start = 1;

        $files->each(function ($item) use (&$records, &$start, $total, $userId) {
            $contents = $item->get();
            $fileName = $item->getClientOriginalName();

            $contentRecords = (new CrfHelper($contents))
                ->setFilename($fileName)
                ->extractCompany()
                ->extractNo()
                ->extractLocation()
                ->extractDate()
                ->extractPaidTo()
                ->extractParticularsAndAmount()
                ->extractCrf()
                ->extractBank()
                ->extractCkNo()
                ->extractPreparedBy()
                ->getRecords($userId);

            $records->push($contentRecords);

            CrfProgress::dispatch("Uploading Crf Filename " . $fileName . " in progress.. ", $start, $total, $userId);
            $start++;
        });

        $validated = CrfHelper::checkProperties($records, $request->bu);

        if (!$validated) {
            return redirect()->back()->with(['status' => false, 'message' => 'Upload failed. The file may be invalid or the company name doesn’t match with the select Business Unit.']);
        }

        $uniqueKeys = $records->pluck('no');
        $existing = Crf::whereIn('no', $uniqueKeys)->pluck('filename');

        DB::transaction(function () use ($records) {
            Crf::insertOrIgnore($records->toArray());
        });

        return redirect()->back()->with([
            'status' => true,
            'message' => ' Files Successfully uploadeded, duplicated records were ignored',
            'duplicates' => $existing //retrieve duplicated files
        ]);
    }

    // public function retrievedCrf(Request $request)
    // {
    //     $records = Crf::filter($request->only('search'))->paginate();
    //     return Inertia::render('retrievedCrf', [
    //         'crf' => $records
    //     ]);
    // }

    public function detailsCrf(Crf $id)
    {
        return Inertia::render('retrievedRecords/checkDetailsCrf', [
            'crf' => $id->toResource()
        ]);
    }
}