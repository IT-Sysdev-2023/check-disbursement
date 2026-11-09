<?php

namespace App\Jobs;

use App\Events\CrfProgress;
use App\Models\Crf;
use App\Helpers\CrfHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Log;
use Throwable;

class CrfUploadingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 1;

    public function __construct(
        public array $files,   // [['path' => ..., 'name' => ...], ...]
        public int $userId,
    ) {
    }

    public function handle(): void
    {
        $records = collect();
        $total = count($this->files);
        $start = 1;

        foreach ($this->files as $file) {
            $contents = Storage::get($file['path']);
            $fileName = $file['name'];

            $helper = (new CrfHelper($contents))->setFilename($fileName);

            if (!$helper->extractCompany()) {
                CrfProgress::dispatch(
                    "Skipping Crf Filename {$fileName} - Company not found.",
                    $start,
                    $total,
                    $this->userId
                );
                $start++;
                continue;
            }

            $records->push(
                $helper->extractNo()
                    ->extractLocation()
                    ->extractCrfDate()
                    ->extractPaidTo()
                    ->extractParticularsAndAmount()
                    ->extractCrf()
                    ->extractBank()
                    ->extractCkNo()
                    ->extractPreparedBy()
                    ->getRecords($this->userId)
            );

            CrfProgress::dispatch(
                "Uploading Crf Filename {$fileName} in progress.. ",
                $start,
                $total,
                $this->userId
            );
            $start++;
        }

        if (!CrfHelper::checkProperties($records, [])) {
            $this->cleanup();
            
            CrfProgress::dispatch(
                'Upload failed. The file may be invalid or the company name doesn’t match with the selected Business Unit.',
                $total,
                $total,
                $this->userId
            );
            return;
        }

        $inserted = DB::transaction(function () use ($records) {
            $count = Crf::insertOrIgnore($records->toArray());
            $crfs = Crf::whereIn('crf_no', $records->pluck('crf_no'))->get();

            return ['inserted_count' => $count, 'crfs' => $crfs];
        });

        $this->cleanup();

        CrfProgress::dispatch(
            "Files successfully uploaded. Inserted: {$inserted['inserted_count']}",
            $total,
            $total,
            $this->userId
        );


    }

    public function failed(Throwable $e): void
    {
        CrfProgress::dispatch(
            'Upload failed: ' . $e->getMessage(),
            0,
            0,
            $this->userId
        );
        $this->cleanup();
    }

    private function cleanup(): void
    {
        Storage::delete(array_column($this->files, 'path'));
    }
}