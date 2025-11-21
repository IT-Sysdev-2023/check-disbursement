<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;

class PermissionService
{
    public static function getCompanyPermissions(User $user)
    {
        $isAdmin = $user->hasRole('admin');

        if ($isAdmin) {
            $bu = Company::all();
        } else {
            $bu = $user->companyPermissions()->with('company')
                ->get()
                ->pluck('company')
                ->filter();
        }

        $transform = $bu->map(function ($company) {
            return [
                'label' => $company->name,
                'value' => $company->id,
            ];
        });

        return $transform;
    }
}