<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bu = [

            [
                'code' => 2,
                'name' => "ASC",
                'company' => "ALTURAS SUPERMARKET CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 3,
                'name' => "MFI",
                'company' => "MARCELA FARMS INCORPORATED",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 6,
                'name' => "LDI",
                'company' => "LEONARDO DISTRIBUTORS, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 9,
                'name' => "BUCAREZ",
                'company' => "BUCAREZ FOOD PROCESSING CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 11,
                'name' => "ROSE EN HONEY",
                'company' => "ROSE EN HONEY FOODLINE, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 12,
                'name' => "CRUSTPEPPER",
                'company' => "CRUST & PEPPER FOODLANE, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 16,
                'name' => "NAUTICA",
                'company' => "NAUTICA SHIPPING & INTEGRATED SERV. INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 18,
                'name' => "CCFI",
                'company' => "CHARCOAL AND CHOP FOODLINE INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 19,
                'name' => "RTFI",
                'company' => "ROAST AND TOAST FOODLINE INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'code' => 22,
                'name' => "MPDI",
                'company' => "MARCELA PHARMA DISTRIBUTORS, INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 23,
                'name' => "BAMDECOR",
                'company' => "BAMDECOR",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 24,
                'name' => "NDI",
                'company' => "NETMAN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 25,
                'name' => "AGC",
                'company' => "Alturas Group of Company",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Company::insert($bu);
        // DB::table('companies')->insert($bu);
    }
}
