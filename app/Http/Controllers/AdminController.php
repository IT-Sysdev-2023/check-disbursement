<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\BankAccount;
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

    public function setupBankAccount()
    {
        return $this->service->setupBankAccount();
    }

    public function storeBank(Request $request)
    {

        return $this->service->storeBank($request);
      
    }

    public function storeBankAccount(Request $request)
    {
        return $this->service->storeBankAccount($request);
    }
}
