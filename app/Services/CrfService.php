<?php

namespace App\Services;
use App\Events\CrfProgress;
use App\Helpers\CrfHelper;
use App\Models\Crf;
use App\Models\Cv;
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

            $helper = (new CrfHelper($contents))
                ->setFilename($fileName);

            // If company cannot be extracted, skip this file
            if (!$helper->extractCompany()) {
                CrfProgress::dispatch(
                    "Skipping Crf Filename " . $fileName . " - Company not found.",
                    $start,
                    $total,
                    $userId
                );

                $start++;

                return;
            }

            $contentRecords = $helper
                ->extractNo()
                ->extractLocation()
                ->extractCrfDate()
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
            return response()->json(['status' => false, 'message' => 'Upload failed. The file may be invalid or the company name doesn’t match with the select Business Unit.']);
        }
        
        // $isDateValid = $records->every(function ($item) use ($request) {
        //     return $item['date']->between($request->start_date, $request->end_date);
        // });

        // if (!$isDateValid) {
        //     return redirect()->back()->with(['status' => false, 'message' => 'Upload failed. One or more records have dates outside the selected range.']);
        // }


        $inserted = DB::transaction(function () use ($records) {

            $insertedCount = Crf::insertOrIgnore($records->toArray());

            $crfs = Crf::whereIn('crf_no', $records->pluck('crf_no'))
                ->get();

            return [
                'inserted_count' => $insertedCount,
                'crfs' => $crfs,
            ];
        });

        self::updateCv($inserted['crfs']);

        return response()->json([
            'status' => true,
            'message' => ' Files Successfully uploaded. ',
            'inserted' => $inserted['inserted_count'],
            'duplicates' => []
            // 'duplicates' => $existing //retrieve duplicated files
        ]);
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