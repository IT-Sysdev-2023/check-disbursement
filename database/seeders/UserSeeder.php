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
            'username' => 'section_head',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('section_head');
        User::create([
            'name' => 'Disbursement Officer',
            'username' => 'disbursement_officer',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('disbursement_officer');
        User::create([
            'name' => 'Cebu/Manila',
            'username' => 'regional_officer',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('regional_officer');
        User::create([
            'name' => 'Closing Cheques',
            'username' => 'closing_officer',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('closing_officer');
    }
}
