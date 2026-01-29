<?php

namespace App\Http\Controllers;

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
}
