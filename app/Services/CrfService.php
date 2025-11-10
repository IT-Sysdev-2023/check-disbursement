<?php

namespace App\Services;
use App\Helpers\CrfHelper;
use App\Models\Crf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CrfService
{
    public function extract($files)
    {
        $records = collect();
        collect($files)->each(function ($item) use (&$records) {
            $contents = $item->get();

            $contentRecords = (new CrfHelper($contents))
                ->setFilename($item->getClientOriginalName())
                ->extractCompany()
                ->extractNo()
                ->extractLocation()
                ->extractDate()
                ->extractPaidTo()
                ->extractParticularsAndAmount()
                ->extractBank()
                ->extractCkNo()
                ->extractPreparedBy()
                ->getRecords();

            $records->push($contentRecords);
        });

        $validated = CrfHelper::checkProperties($records);

        if (!$validated) {
            return redirect()->back()->with(['status' => false, 'message' => 'Upload failed. Please try again.']);
        }

        DB::transaction(function () use ($records) {
            Crf::insert($records->toArray());
        });

        return redirect()->back()->with(['status' => true, 'message' => ' Files Successfully uploaded, you may now view here.']);
    }

    public function validateRecord()
    {

    }
}