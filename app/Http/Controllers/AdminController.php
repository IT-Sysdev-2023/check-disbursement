<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class AdminController extends Controller
{
    public function users(){
        $users = User::with('roles', 'permissions')->select('id', 'name', 'username')->where('is_active', true)->paginate();
            return Inertia::render('admin/users', [
                'users' => $users
            ]);
    }

    public function permissions(){
        $permissions = Permission::select('id','name')->get();
        return response()->json($permissions);
    }

    public function assignPermissions(Request $request){
        $request->validate([
            'selectedPermission' => 'required|array|min:1',
        ]);
        dd($request->all());
    }
}
