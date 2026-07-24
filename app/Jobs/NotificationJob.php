<?php

namespace App\Jobs;

use App\Models\Cv;
use App\Models\SyncState;
use App\Models\User;
use App\Notifications\NavitionNotification;
use App\Services\GenerateCvService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

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
        $latestCvNos = Cv::selectRaw('business_unit_id, MAX(cv_no) as cv_no')
            ->groupByRaw('business_unit_id, YEAR(cv_date), MONTH(cv_date)');

        $cvs = Cv::with(['businessUnit.navDatabase' => ['navServer', 'navHeaderTable']])
            ->joinSub($latestCvNos, 'latest', function ($join) {
                $join->on('cvs.business_unit_id', '=', 'latest.business_unit_id')
                    ->on('cvs.cv_no', '=', 'latest.cv_no');
            })->get();

        $users = User::role('disbursement_officer')->get();
        $cvs->each(function ($item) use ($users) {

            $totalNewRecords = (new GenerateCvService())
                ->setConnection(
                    $item->businessUnit->navDatabase->navServer,
                    $item->businessUnit->navDatabase->name
                )->latestRecord(
                    $item->businessUnit->navDatabase->navHeaderTable->name,
                    $item->cv_no,
                    $item->cv_date
                );

            if (!$totalNewRecords)
                return;

            $syncState = SyncState::firstOrNew([
                'business_unit_id' => $item->businessUnit->id,
                'last_cv_date' => $item->cv_date->format('Y-m'),
            ]);

            if (
                !$syncState->exists ||
                ($syncState->last_cv_no !== $item->cv_no)
            ) {
                Notification::send(
                    $users,
                    new NavitionNotification(
                        $totalNewRecords,
                        $item->businessUnit->name,
                        $item->cv_date
                    )
                );

                $syncState->last_cv_no = $item->cv_no;
                $syncState->save();
            }

        });


    }
}
