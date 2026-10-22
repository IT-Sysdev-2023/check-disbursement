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
            'username' => 'corporate_accounting_supervisor',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('corporate_accounting_supervisor');
        User::create([
            'name' => 'Disbursement Officer',
            'username' => 'corporate_disbursing_officer',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('corporate_disbursing_officer');
        User::create([
            'name' => 'Cebu/Manila',
            'username' => 'corporate_disbursing_clerk(forwarded_releasing)',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('corporate_disbursing_clerk(forwarded_releasing)');
        User::create([
            'name' => 'Closing Cheques',
            'username' => 'corporate_disbursing_clerk(closing)',
            'password' => Hash::make('12341234'), // hash the password
        ])->assignRole('corporate_disbursing_clerk(closing)');
    }
}
