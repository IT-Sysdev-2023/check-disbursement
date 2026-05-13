<?php

namespace Database\Seeders;

use App\Models\BorrowerName;
use App\Models\Company;
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
            BusinessUnitSeeder::class,
            NavDatabaseSeeder::class,
            NavCpSeeder::class,
            NavHeaderSeeder::class,
            // NavLineSeeder::class,
            BorrowerNameSeeder::class,
            BankSeeder::class
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
        User::firstOrCreate(
            ['username' => 'releasing'],
            [
                'name' => 'renan',
                'password' => Hash::make('12341234'),
            ]
        );
        User::firstOrCreate(
            ['username' => 'kent'],
            [
                'name' => 'Kent Abarquez',
                'password' => Hash::make('12341234'),
            ]
        );



        // $ret = Company::select('name')->get();

        // $ret->each(function ($item) {
        //     Permission::create(['name' => $item->name]);
        // });

        // Role::create(['name' => 'releasing']);
        // Role::create(['name' => 'scanning']);
        Role::create(['name' => 'disbursement_officer']);
        Role::create(['name' => 'closing_officer']);
        Role::create(['name' => 'regional_officer']);
        Role::create(['name' => 'section_head']); //section head
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'viewing']);

        Permission::create(['name' => 'access cebu']);
        Permission::create(['name' => 'access manila']);
        // $admin->givePermissionTo(Permission::all());


        $user = User::first();
        $user->assignRole('admin');

    }
}
