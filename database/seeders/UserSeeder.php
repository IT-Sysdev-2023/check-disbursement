<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Section Head',
            'username' => 'sh',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('sh');
        User::create([
            'name' => 'Police Officer',
            'username' => 'officer',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('officer');
        User::create([
            'name' => 'Cebu/Manila',
            'username' => 'forwarded',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('forwarded');
        User::create([
            'name' => 'Closing Cheques',
            'username' => 'closing',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('closing');
    }
}
