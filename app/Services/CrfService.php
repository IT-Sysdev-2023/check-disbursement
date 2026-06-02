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
        return Inertia::render('extract/extractCrf', [
            'bu' => $bu
        ]);
    }
    public function extract(Request $request)
    {
        $request->validate([
            'files' => 'required',
            'files.*' => 'file|max:5120|unique:crfs,filename',
            // 'start_date' => 'required|date',
            // 'end_date' => 'required|date|after_or_equal:start_date',
            // 'bu' => ['required', 'array', 'min:1']
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

        $validated = CrfHelper::checkProperties($records, []);

        if (!$validated) {
            return redirect()->back()->with(['status' => false, 'message' => 'Upload failed. The file may be invalid or the company name doesn’t match with the select Business Unit.']);
        }

        // $isDateValid = $records->every(function ($item) use ($request) {
        //     return $item['date']->between($request->start_date, $request->end_date);
        // });

        // if (!$isDateValid) {
        //     return redirect()->back()->with(['status' => false, 'message' => 'Upload failed. One or more records have dates outside the selected range.']);
        // }

        DB::transaction(function () use ($records) {
            Crf::insertOrIgnore($records->toArray());
        });

        // $hasExisting = !empty($existing) ? 'Duplicates are listed below and were ignored.' : '';

        return redirect()->back()->with([
            'status' => true,
            'message' => ' Files Successfully uploaded. ',
            'duplicates' => []
            // 'duplicates' => $existing //retrieve duplicated files
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
            'crf' => $id->load('chequeStatus.chequeForwardedStatus')->toResource()
        ]);
    }
}