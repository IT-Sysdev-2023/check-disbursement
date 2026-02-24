<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class BusinessUnitAssignedScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = auth()->user();

        if (!$user) {
            return; // Prevent crashes in CLI, queues, etc.
        }

        if ($user->hasRole('disbursement_officer')) {
            $roleIds = $user->companyPermissions->pluck('company_id');
            $builder->whereIn($model->getTable() . '.company_id', $roleIds);
        }

        // Regional Officer restriction
        // if ($user->hasRole('regional_officer')) {
           

        //     if ($user->hasPermissionTo('access manila')) {
        //         $builder->whereHas('tagLocation', function ($query) {
        //             $query->where('location', 'Manila');
        //         });
        //     }
        // }


    }
}
