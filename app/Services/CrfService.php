<?php

namespace App\Services;
use App\Helpers\CrfHelper;
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
            ;
        });

        dd($records);
    }

    public function validateRecord()
    {

    }
}