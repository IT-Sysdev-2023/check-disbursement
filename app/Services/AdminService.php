<?php

namespace App\Services;

use App\Models\Bank;
use App\Models\Company;
use App\Models\CompanyPermission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
class AdminService
{
    public function users()
    {
        $users = User::with('roles', 'permissions', 'companyPermissions.company')->select('id', 'name', 'username')->where('is_active', true)
            ->paginate()
            ->withQueryString()
            ->toResourceCollection();
        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

    public function permissions()
    {
        $permissions = Company::select('id as value', 'name as label')
            ->get();

        $roles = Role::select('id as value', 'name as label')
            ->get();

        $accessPermission = Permission::select('id as value', 'name as label')
            ->get();

        return response()->json(['permissions' => $permissions, 'roles' => $roles, 'accessPermission' => $accessPermission]);
    }

    public function assignPermissions(Request $request)
    {

        $request->validate([
            'selectedPermission' => 'required|array|min:1',
            'id' => 'required|int'
        ]);

        $user = User::findOrFail($request->id);

        if (!empty($request->selectedPermission)) {

            $companyIds = Company::whereIn('name', $request->selectedPermission)
                ->pluck('id')
                ->toArray();

            $user->companyPermissions()->delete();

            $records = collect($companyIds)->map(fn($companyId) => [
                'user_id' => $user->id,
                'company_id' => $companyId,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            CompanyPermission::insert($records);
        }

        // Sync Roles
        if (!empty($request->selectedRole)) {
            $user->syncRoles($request->selectedRole);
        }

        // Sync Direct Permissions
        if (!empty($request->selectedAccessPermission)) {
            $user->syncPermissions($request->selectedAccessPermission);
        }
        return redirect()->back()->with(['status' => true, 'message' => 'Bank Created Successfully']);
    }

    public function setupBank()
    {
        return Inertia::render('admin/bankSetup');
    }
    public function setupBankAccount()
    {
        $banks = Bank::select('id as value', 'name as label')
            ->get();
        return Inertia::render('admin/bankAccountSetup', [
            'banks' => $banks
        ]);
    }
}