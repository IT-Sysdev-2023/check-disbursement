<?php

namespace App\Helpers;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
class FileHandler
{
    protected string $folderName = '';

    protected string $fileName = '';
    protected $disk;
    public function __construct(Filesystem $disk)
    {
        $this->disk = $disk;
    }

    public function inFolder(string $folderName)
    {
        $this->folderName = Str::trim($folderName);

        return $this;
    }

    public function createFileName(int $uniqueIdentifier, int $causerId, $extension = '.jpg')
    {
        $this->fileName = "{$uniqueIdentifier}-{$causerId}-" . now()->format('Y-m-d-His') . Str::start($extension, '.');
        return $this;
    }

    public function handlePdf(array $data, string $bladeTemplate){
        $pdf = Pdf::loadView($bladeTemplate, ['data' => $data])->setPaper('A5');

        // Get raw PDF output
        $output = $pdf->output();
       $this->disk->put($this->folder() . $this->fileName, $output);

        // Encode in Base64
        $base64 = base64_encode($output);

        return "data:application/pdf;base64," . $base64;
    }

    
    public function saveSignature($signature)
    {
        $filteredSignature = preg_replace('/^data:image\/\w+;base64,/', '', $signature);

        $imageData = base64_decode($filteredSignature);

        $this->disk->put($this->folder() . $this->fileName, $imageData);

        return  $this->folder() . $this->fileName;
    }

    protected function folder()
    {
        return Str::finish($this->folderName, '/');
    }


    protected function destroyFile(Request $request, $file)
    {
        //delete old image
        if ($request->hasFile('file')) {
            return $this->disk->delete($this->folder() . $file);
        }
    }

    public function saveFile($file)
    {
            return $this->disk->putFileAs($this->folder(), $file, $this->fileName);
    }

    protected function saveMultiFiles(Request $request, $id, callable $callback)
    {
        if ($request->hasFile('file')) {
            foreach ($request->file as $image) {
                $name = $this->getOriginalFileName($request, $image);
                $path = $this->disk->putFileAs($this->folder(), $image, $name);

                $callback($id, $path, $image, $name);
            }
        }
    }
    protected function savePdfFile(Request $request, string|int $identifier, $pdf, $date = null)
    {
        $date = $date ?: now()->format('Y-m-d-His');
        $filename = "{$request->user()->user_id}-{$identifier}-" . $date . ".pdf";
        return $this->disk->put("{$this->folder()}{$filename}", $pdf);
    }
    protected function retrieveFile(string $folder, string $filename)
    {
        $file = "{$folder}/{$filename}";
        if ($this->disk->exists($file)) {
            $pdf = $this->disk->get($file);
            return response($pdf, 200)->header('Content-Type', 'application/pdf');
        } else {
            return response()->json('File Not Found on the Server', 404);
        }
    }
    public function getFilesFromDirectory(?string $subfolder = null, bool $includeSubdirectory = false)
    {
        $trim = Str::finish($this->folder() . $subfolder, '/');
        $path = $subfolder ? $trim : $this->folder();

        if ($includeSubdirectory) {
            return collect($this->disk->allFiles($path));
        }

        return collect($this->disk->files($path));
    }
    public function download(string $file, ?string $subfolder = null)
    {
        $filename = Str::start($file, '/');
        $fullpath = $this->folder() . $subfolder . $filename;
        if ($this->disk->exists($fullpath)) {
            return $this->disk->download($fullpath);
        } else {
            return response()->json(['error' => 'File Not Found'], 404);
        }
    }

    public function getOriginalFileName(Request $request, $image)
    {
        $filename = $this->createFileName($request);
        // dd($request->all());
        $originalName = $image->getClientOriginalName();
        $nameWithoutExtension = pathinfo($originalName, PATHINFO_FILENAME);

        //remove special Unicode character (\u{202F})
        $cleanedFilename = preg_replace('/[^\x20-\x7E]/', '', $nameWithoutExtension);
        $name = Str::replace(' ', '-', $cleanedFilename);

        return "{$name}-{$filename}";
    }
}