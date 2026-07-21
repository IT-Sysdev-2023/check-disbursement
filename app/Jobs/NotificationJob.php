<?php

namespace App\Jobs;

use App\Models\Cv;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // $bu = Cv::select('business_unit_id')
        //     ->distinct()
        //     ->get();

        // dd($bu);
        $businessUnits = DB::table(DB::raw('(
                select
                    DATE_FORMAT(cv_date, "%Y-%m") as month_year,
                    business_units.name as business_unit,
                    business_units.id as buId,
                    cvs.row_version,
                    cvs.cheque_number,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE_FORMAT(cv_date, "%Y-%m")
                        ORDER BY cvs.row_version DESC
                    ) as rn
                from cvs
                inner join business_units 
                    on business_units.id = cvs.business_unit_id
                where business_units.company_id != 13
              
            ) as latest'))
            ->select(
                'month_year',
                'business_unit',
                'buId',
                'row_version',
                'cheque_number'
            )
            ->where('rn', 1)
            ->orderBy('month_year')
            ->get();

        // $businessUnits->each(function ($bu) {
        //     $cv = Cv::where('business_unit_id', $bu->buId)
        //         ->whereRaw('DATE_FORMAT(cv_date, "%Y-%m") = ?', [$bu->month_year])
        //         ->where('row_version', '!=', $bu->row_version)
        //         ->first();

        //     if ($cv) {
        //         $this->sendNotification($cv);
        //     }
        // });


        // Log::info($cv->toArray());
    }
}
