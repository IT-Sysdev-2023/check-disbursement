<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function banks()
    {

        $banks = Bank::select('id', 'name')
            ->selectRaw('id as value, name as label')
            ->where('is_active', true)
            ->with('bankAccounts')
            ->get();
        return response()->json($banks);
    }
}
