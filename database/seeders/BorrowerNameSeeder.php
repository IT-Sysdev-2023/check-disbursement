<?php

namespace Database\Seeders;

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
            ['name' => 'Adrian Montefalco'],
            ['name' => 'Zyrone Alcaraz'],
            ['name' => 'Elijah Vergara'],
            ['name' => 'Alec Imperial'],
        ]);
    }
}
