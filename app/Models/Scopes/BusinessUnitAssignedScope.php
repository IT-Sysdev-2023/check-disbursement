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
        $roleIds = auth()->user()->companyPermissions->pluck('company_id');
        $builder->whereIn($model->getTable() . '.company_id',$roleIds);
    }
}
