<?php

namespace App\Services;

use App\Events\ScanProgress;
use App\Models\ScannedRecords;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\LazyCollection;

class ScannedRecordsService
{
    private int $totalRecords;
    private string $filename;
    public function scan(int $id)
    {
        $files = self::directory();

        foreach ($files as $fileIndex => $file) {
            $this->filename = $this->getBuLazy($file);
            $totalFiles = count($files);
            LazyCollection::make(function () use ($file) {

                $handle = self::openFile($file);

                while (!feof($handle)) {
                    yield fgets($handle);
                }

                fclose($handle);
            })->tap(function (LazyCollection $collection) {
                $this->totalRecords = $collection->count();
            })->each(function ($line, $index) use ($id, $totalFiles, $fileIndex) {
                ScanProgress::dispatch("Retrieving Scanned checks in progress.. ", $index, $this->totalRecords, $id, $totalFiles, $fileIndex);

                if (!preg_match('/^\s*\d+\s+\d{2}\/\d{2}\/\d{4}/', $line)) {
                    return;
                }

                // Parse using regex (flexible for spacing)
                $pattern = '/^\s*(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d+)\s+(\d+)\s+([A-Z- ]+)\s+([\d,]+\.\d{2})/';

                if (preg_match($pattern, $line, $m)) {
                    ScannedRecords::insertOrIgnore([
                        'bu' => $this->filename,
                        'seq' => $m[1],
                        'date' => Date::createFromFormat('m/d/Y', $m[2]),
                        'account_no' => $m[3],
                        'posted_date' => Date::createFromFormat('m/d/Y', $m[4]),
                        'check_no' => $m[5],
                        'branch_code' => $m[6],
                        'branch_name' => trim($m[7]),
                        'amount' => str_replace(',', '', $m[8]),
                        'caused_by' => $id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            });
        }
        return redirect()->back()->with(['status' => true, 'message' => 'Done Sync']);
    }

    private function getBuLazy($file)
    {
        $handle = self::openFile($file);

        while (!feof($handle)) {
            $line = fgets($handle);
            $trim = trim($line);

            if ($trim !== '') {
                fclose($handle);
                return $trim;
            }
        }

        fclose($handle);
        return null;
    }

    private static function openFile($file)
    {
        if (PHP_OS_FAMILY === 'Linux') {
            return fopen($file->getPathname(), 'r');
        }

        return Storage::disk('scanned')->readStream($file);
    }

    private static function directory()
    {
        if (PHP_OS_FAMILY === 'Linux') {
            return File::files('/mnt/sharedTeo');
        }
        return Storage::disk('scanned')->files();//windows
    }

    private static function getContents($file)
    {
        if (PHP_OS_FAMILY === 'Linux') {
            return File::get($file);
        }
        return Storage::disk('scanned')->get($file);
    }
}