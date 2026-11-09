<?php

namespace App\Services;

class ChequeNoChecker
{
    public static function classifyChequeSide(string $text): string
    {
        $text = strtoupper($text);
        $text = preg_replace('/\s+/', ' ', $text);


        $frontKeywords = [
            'ACCOUNT NO.',
        ];
        $frontScore = collect($frontKeywords)
        ->filter(fn($keyword) => str_contains($text, $keyword))
        ->count();

        return $frontScore;
    }
}