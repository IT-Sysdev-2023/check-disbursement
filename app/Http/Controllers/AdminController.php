<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyPermission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class AdminController extends Controller
{
    public function users()
    {
        $users = User::with('roles', 'permissions', 'companyPermissions.company')->select('id', 'name', 'username')->where('is_active', true)->paginate();
        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

    public function permissions()
    {
        $permissions = Company::select('id', 'name')->get();
        return response()->json($permissions);
    }

    public function assignPermissions(Request $request)
    {

        $request->validate([
            'selectedPermission' => 'required|array|min:1',
            'id' => 'required|int'
        ]);

        // Get all company IDs at once
        $companyIds = Company::whereIn('name', $request->selectedPermission)->pluck('id', 'name');

        $records = [];

        foreach ($request->selectedPermission as $permissionName) {
            if (!isset($companyIds[$permissionName]))
                continue;

            $records[] = [
                'user_id' => $request->id,
                'company_id' => $companyIds[$permissionName],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Replace old permissions with new ones
        CompanyPermission::where('user_id', $request->id)->delete();

        // Bulk insert
        CompanyPermission::insert($records);

        return redirect()->back()->with(['status' => true, 'message' => 'Successfully Updated']);
    }
}
