<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

    $this->call([
        CompanySeeder::class,
        NavServerSeeder::class,
        NavCpSeeder::class,
        NavHeaderSeeder::class,
        NavLineSeeder::class,
    ]);

        User::firstOrCreate(
            ['username' => 'san'],
            [
                'name' => 'San Palban',
                'password' => Hash::make('12341234'),
            ]
        );
        User::firstOrCreate(
            ['username' => 'teo'],
            [
                'name' => 'Teo',
                'password' => Hash::make('12341234'),
            ]
        );
        
        $admin = Role::create(['name' => 'admin']);
         $admin->givePermissionTo(Permission::all());
        $user = User::first();
        $user->assignRole('admin');
    
    }
}
