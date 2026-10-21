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
    protected Filesystem $disk;
    public function __construct(Filesystem $disk)
    {
        $this->disk = $disk;
    }

    public function disk(): Filesystem
    {
        return $this->disk;
    }

    public function inFolder(string $folderName)
    {
        $this->folderName = Str::trim($folderName);

        return $this;
    }

    public function createFileName(int|string $uniqueIdentifier, int $causerId, $extension = '.jpg')
    {
        $this->fileName = "{$uniqueIdentifier}-{$causerId}-" . now()->format('Y-m-d-His') . Str::start($extension, '.');
        return $this;
    }

    public function handlePdf(array $data, string $bladeTemplate, $paper = 'letter')
    {
        $pdf = Pdf::loadView($bladeTemplate, ['data' => $data])->setPaper($paper);

        $path = $this->folder() . $this->fileName;
        $this->disk->put($path, $pdf->output());

        return $path; // e.g. "pdfs/borrowed/123_4.pdf"
        // Get raw PDF output
        // $output = $pdf->output();
        // $this->disk->put($this->folder() . $this->fileName, $output);

        // // Encode in Base64
        // $base64 = base64_encode($output);

        // return "data:application/pdf;base64," . $base64;
    }

    public function show(Request $request)
    {
        $path = $request->query('path');

        // Security: only allow files inside the pdfs/ folder, no ../ tricks
        abort_unless(
            is_string($path)
            && str_starts_with($path, 'pdfs/')
            && !str_contains($path, '..'),
            403
        );

        $disk = Storage::disk('public'); // use the same disk your file handler uses
        abort_unless($disk->exists($path), 404);

        return response()->file($disk->path($path), [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function handleSavePdf(
        array $data,
        string $bladeTemplate,
        string $paper = 'letter'
    ): void {
        $pdf = Pdf::loadView($bladeTemplate, [
            'data' => $data,
        ])->setPaper($paper);

        $this->disk->put(
            $this->folder() . $this->fileName,
            $pdf->output()
        );
    }


    public function saveSignature($signature)
    {
        $filteredSignature = preg_replace('/^data:image\/\w+;base64,/', '', $signature);

        $imageData = base64_decode($filteredSignature);

        $this->disk->put($this->folder() . $this->fileName, $imageData);

        return $this->folder() . $this->fileName;
    }

    public function toDataUri($signaturePath)
    {
        $disk = $this->disk;
        if ($disk->exists($signaturePath)) {
            $imageData = $disk->get($signaturePath);

            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->buffer($imageData);

            return 'data:' . $mime . ';base64,'
                . base64_encode($imageData);
        }
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

    public function handleFiles(array $validated, string $transactionNo)
    {
        $userId = auth()->user()->id;
        $uuid = Str::uuid();

        $signaturePath = $this
            ->inFolder($transactionNo . "/signatures")
            ->createFileName($uuid, $userId, '.png')
            ->saveSignature($validated['signature']);

        $uri = $this->toDataUri($signaturePath);

        $imagePath = '';
        if ($validated['file']) {
            $imagePath = $this
                ->inFolder($transactionNo . "/images")
                ->createFileName($uuid, $userId, '.png')
                ->saveFile($validated['file']);
        }

        return (object) [
            'signaturePath' => $signaturePath,
            'imagePath' => $imagePath,
            'signatureUri' => $uri
        ];
    }
}