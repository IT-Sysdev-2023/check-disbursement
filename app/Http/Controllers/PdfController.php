<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;

class PdfController extends Controller
{
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
}
