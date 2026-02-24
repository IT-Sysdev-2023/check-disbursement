<?php

namespace App\Services;

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
        $permissions = Company::select('id', 'name')
            ->get()
            ->map(function ($name) {
                return [
                    'label' => $name->name,
                    'value' => $name->id,
                ];
            });

        $roles = Role::select('id', 'name')
            ->get()
            ->map(function ($name) {
                return [
                    'label' => $name->name,
                    'value' => $name->id,
                ];
            });

        $accessPermission = Permission::select('id', 'name')
            ->get()
            ->map(function ($name) {
                return [
                    'label' => $name->name,
                    'value' => $name->id,
                ];
            });

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
        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}