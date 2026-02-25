<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\Company;
use App\Models\CompanyPermission;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

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

    public function assign(User $id){
          return Inertia::render('admin/assignUser',['user' => new UserResource($id->load('companyPermissions.company'))]);
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255', //'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with(['status' => true, 'message' => 'User created']);

    }
}
