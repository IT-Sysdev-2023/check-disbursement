<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavSeeder3 extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $line = [
            [
                'nav_database_id' => 1,
                'name' => 'CARMEN AGRI FARM$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 2,
                'name' => 'CHOWKING ALTA CITTA$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 3,
                'name' => 'CORTES FERTILIZER PLANT_ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 4,
                'name' => 'Dao Water Pumping Accounting$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 5,
                'name' => 'Delivery & Trucking Accounting$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 6,
                'name' => 'MFI_CORTES_PIGGERY_ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 7,
                'name' => 'MFI_CORTES_POULTRY_ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 8,
                'name' => 'MFI - ICE PLANT$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 9,
                'name' => 'MFI SLAUGHTER HOUSE II$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 11,
                'name' => 'MPDI ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 12,
                'name' => 'NOODLES FACTORY ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 13,
                'name' => 'PRAWNFARM_ICM_ACCTG$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 14,
                'name' => 'SON-OK AGRI FARM$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 15,
                'name' => 'ALTA CITTA ACCOUNTING$CV Line',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        DB::table('nav_line_tables')->insert($line);
    }
}
