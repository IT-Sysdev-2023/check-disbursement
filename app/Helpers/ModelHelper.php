<?php

namespace App\Helpers;

use App\Models\Crf;
use App\Models\CvCheckPayment;

class ModelHelper
{
    public static function parent($check, $id)
    {
        return $check === 'cv' ? CvCheckPayment::findOrFail($id) : Crf::findOrFail($id);
    }
}