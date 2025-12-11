<?php

namespace App\Services;
use App\Events\CrfProgress;
use App\Helpers\CrfHelper;
use App\Models\Crf;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CrfService
{
    public function extract($files, $userId, array $bu)
    {
        $records = collect();
        
        $files = collect($files);
        $total = $files->count();
        $start = 1;

        $files->each(function ( $item) use (&$records, &$start, $total, $userId) {
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

        $validated = CrfHelper::checkProperties($records, $bu);

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
}