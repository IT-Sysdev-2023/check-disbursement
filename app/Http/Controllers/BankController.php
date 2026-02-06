<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function banks()
    {

        $banks = Bank::select('id', 'acronym')
         ->selectRaw('id as value, acronym as label')
        ->where('is_active', true)
            ->with('bankAccounts')
            ->get();
        return response()->json($banks);
    }
}
