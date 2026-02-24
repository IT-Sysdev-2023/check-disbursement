<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Company;
use App\Models\CompanyPermission;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{

    public function __construct(protected AdminService $service)
    {

    }
    public function users()
    {
        return $this->service->users();
    }

    public function permissions()
    {
        return $this->service->permissions();
    }

    public function assignPermissions(Request $request)
    {
        return $this->service->assignPermissions($request);
    }

    public function setupBank()
    {
        return $this->service->setupBank();
    }

    public function storeBank(Request $request)
    {
        $request->validate([
            'bank' => 'required|string|max:255',
            'acronym' => 'required|string|max:255',
        ]);
       Bank::create([
            'name' => $request->bank,
            'acronym' => $request->acronym,
            'caused_by' => auth()->id(),
        ]);

        return redirect()->back()->with(['status' => true, 'message' => 'Bank added successfully']);
    }
}
