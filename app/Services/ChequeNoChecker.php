<?php

namespace App\Services;

class ChequeNoChecker
{
    public static function classifyChequeSide(string $text): string
    {
        $text = strtoupper($text);

        $frontKeywords = [
            'CHECK NO.',
            'ACCOUNT NO.',
            'ACCOUNT NAME',
            'PAY TO THE ORDER OF',
            'PESOS',
        ];

        $frontScore = collect($frontKeywords)
            ->filter(fn($keyword) => str_contains($text, $keyword))
            ->count();

        if ($frontScore >= 2) {
            return 'front';
        }

        return 'back';
    }
}