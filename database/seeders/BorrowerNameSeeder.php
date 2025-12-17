<?php

namespace Database\Seeders;

use App\Models\Approver;
use App\Models\BorrowerName;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BorrowerNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BorrowerName::insert([
            ['name' => 'Adrian Montefalco', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Zyrone Alcaraz', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Elijah Vergara', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Alec Imperial', 'created_at' => now(), 'updated_at' => now()],
        ]);

        Approver::insert([
            ['name' => 'Incorporator A', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Incorporator B', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Incorporator C', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
