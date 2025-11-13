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
                'code' => "01",
                'name' => "AGC",
                'company' => "ALTURAS GROUP OF COMPANIES",
                'created_at' => now(),
                'updated_at' => now(),

            ],
            [
                'code' => "02",
                'name' => "ASC",
                'company' => "ALTURAS SUPERMARKET CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "03",
                'name' => "MFI",
                'company' => "MARCELA FARMS INCORPORATED",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "04",
                'name' => "MFRI",
                'company' => "MARCELA'S FRONTIER RESOURCES, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "05",
                'name' => "BOHOL ONLINE",
                'company' => "BOHOL ONLINE SYSTEMS, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "06",
                'name' => "LDI",
                'company' => "LEONARDO DISTRIBUTORS, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "07",
                'name' => "CEBO",
                'company' => "CEBO DEVELOPMENT CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "08",
                'name' => "AGROMARINE",
                'company' => "BOHOL AGRO-MARINE DEVELOPMENT CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "09",
                'name' => "BUCAREZ",
                'company' => "BUCAREZ FOOD PROCESSING CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "10",
                'name' => "PANGLAO BAY",
                'company' => "PANGLAO BAY PREMIERE PARKS & RESORTS CORPORATION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "11",
                'name' => "ROSE EN HONEY",
                'company' => "ROSE EN HONEY FOODLINE, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "12",
                'name' => "CRUSTPEPPER",
                'company' => "CRUST & PEPPER FOODLANE, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "13",
                'name' => "ASC TECH",
                'company' => "ASC TECH. SOLUTIONS, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "14",
                'name' => "ABENSON",
                'company' => "ALTURAS-ABENSON APPLIANCE BOHOL, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "15",
                'name' => "NETMAN",
                'company' => "NETMAN DIST., INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "16",
                'name' => "NAUTICA",
                'company' => "NAUTICA SHIPPING & INTEGRATED SERV. INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "17",
                'name' => "BTV",
                'company' => "BOHOL TECH VOC, INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "18",
                'name' => "CCFI",
                'company' => "CHARCOAL AND CHOP FOODLINE INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "19",
                'name' => "RTFI",
                'company' => "ROAST AND TOAST FOODLINE INC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "20",
                'name' => "KOMPAS RESORTS",
                'company' => "KOMPAS RESORTS AND HOTELS, INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "21",
                'name' => "BMHI",
                'company' => "BISAYAN MARINE HATCHERY, INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => "22",
                'name' => "MPDI",
                'company' => "MARCELA PHARMA DISTRIBUTORS, INC.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Company::insert($bu);
        // DB::table('companies')->insert($bu);
    }
}
