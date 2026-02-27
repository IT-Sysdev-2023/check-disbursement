<?php

namespace App\Models\Scopes;

use App\Models\BusinessUnit;
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
            $builder->whereHas('businessUnit.company.companyPermissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
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
