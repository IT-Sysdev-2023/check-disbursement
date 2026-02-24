<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CheckStatus extends Model
{
     protected $guarded = [];

     protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];

    }

     public function checkable()
     {
          return $this->morphTo();
     }

     public function checkForwardedStatus(){
        return $this->hasOne(CheckForwardedStatus::class);
     }

    #[Scope]
    protected function regionalPermission(Builder $query): void
    {
        $query->where(function ($query) {

            $user = auth()->user();
            $locations = [];

            if ($user->hasPermissionTo('access cebu')) {
                $locations[] = 'Cebu';
            }

            if ($user->hasPermissionTo('access manila')) {
                $locations[] = 'Manila';
            }

            if (!empty($locations)) {
                $query->whereHasMorph(
                    'checkable',
                    [CvCheckPayment::class, Crf::class],
                    function ($morphQuery) use ($locations) {
                        $morphQuery->whereHas('tagLocation', function ($locationQuery) use ($locations) {
                            $locationQuery->whereIn('location', $locations);
                        });
                    }
                );
            }
        });
    }
}
