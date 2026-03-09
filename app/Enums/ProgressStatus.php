<?php

namespace App\Enums;
enum ProgressStatus: string
{
    case Processing = 'processing';
    case NoRecord = 'no_record';
    case Finished = 'finished';
}