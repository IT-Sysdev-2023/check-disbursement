<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $servers = [
            [
                'name' => '172.16.161.11',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.161.7',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.98.215',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.217.112',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.220.2',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.161.123',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.161.127',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.104.1',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.192.4',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.192.1',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => '172.16.105.11',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        //INCOMPLETE
        $dbNames = [
            [
                'nav_server_id' => 1,
                'name' => 'CARMEN AGRI FARM',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()

            ],
            [
                'nav_server_id' => 1,
                'name' => 'CHOWKING_ALTACITTA_ACCTG',
                'module' => 'CV',
                'company' => 'ROSE AND HONEY',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'CORTES FERTILIZER PLANT_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DAO_WATER_PUMPING',
                'module' => 'CRF',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DEL&TRUCK_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_PIGGERY_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_POULTRY_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_ICEPLANT_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_SLAUGHTER_HOUSE_II',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_TIPCAN_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MPDI_ACCTG_SQL',
                'module' => 'CV',
                'company' => 'MPDI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'NOODLES_FACTORY_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'PRAWNFARM_ICM_ACCTG',
                'module' => 'CV',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'SUN-OK AGRI FARM',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ALTA_CITTA_ACCTG',
                'module' => 'CV',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ALTURAS GLASS SERVICE',
                'module' => 'CV',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ASC_TECH_TAGBI',
                'module' => 'CV',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'GREENWICH ALTURAS SQL',
                'module' => 'CV',
                'company' => 'ROSE AND HONEY',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE ALTA CITTA',
                'module' => 'CV',
                'company' => 'ROAST AND TOAST FOODLINE, INC.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE DRIVE THRU SQL',
                'module' => 'CV',
                'company' => 'ROAST AND TOAST FOODLINE, INC.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE PANGLAO',
                'module' => 'CV',
                'company' => 'ROAST AND TOAST FOODLINE, INC.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE PLAZA MARCELA',
                'module' => 'CV',
                'company' => 'ROSE AND HONEY',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE_TALIBON_ACCTG',
                'module' => 'CV',
                'company' => 'CRUST AND PEPPER',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE_TUBIGON_ACCTG',
                'module' => 'CV',
                'company' => 'CRUST AND PEPPER',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'LDI_ACCTG_SQL',
                'module' => 'CV',
                'company' => 'LDI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MANG_INASAL-ICM',
                'module' => 'CV',
                'company' => 'CHARCOAL AND CHOP FOODLINE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MANG_INASAL-TALIBON',
                'module' => 'CV',
                'company' => 'CHARCOAL AND CHOP FOODLINE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MEAL TIME EXPRESS ACCTG',
                'module' => 'CV',
                'company' => 'CHARCOAL AND CHOP FOODLINE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MFI_RICEMILL_ACCTG 2',
                'module' => 'CRF',
                'company' => 'MFI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'NAUTICA_SHIPPING_ACCTG',
                'module' => 'CV',
                'company' => 'NAUTICA',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'NETMAN_ACCTG',
                'module' => 'CV',
                'company' => 'NDI',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PANGLAO_FR_ACCTG',
                'module' => 'CV',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PEANUTKISSES_ACCTG',
                'module' => 'CV',
                'company' => 'BUCAREZ',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PHARMA_DC_ACCTG',
                'module' => 'CRF',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PLANNING_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PRAWN FARM ALTA CITTA ACCTG',
                'module' => 'CV',
                'company' => 'CHARCOAL AND CHOP FOODLINE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PRAWNFARM PANGLAO ACCTG',
                'module' => 'CV',
                'company' => 'ROAST AND TOAST FOODLINE, INC. ',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'RED RIBBON TUBIGON ACCTG',
                'module' => 'CV',
                'company' => 'CRUST AND PEPPER',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'RED_RIBBON_TALIBON_ACCTG',
                'module' => 'CV',
                'company' => 'CRUST AND PEPPER',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'WDG_ACCTG_SQL',
                'module' => 'CV',
                'company' => 'ASC',
                'created_at' => now(),
                'updated_at' => now()
            ],
            
        ];

        //Unfinished
        $tables = [
            [
                'nav_database_id' => 1,
                'name' => 'CARMEN AGRI FARM$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 2,
                'name' => 'CHOWKING ALTA CITTA$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 3,
                'name' => 'CORTES FERTILIZER PLANT_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 4,
                'name' => 'Dao Water Pumping Accounting$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 5,
                'name' => 'Delivery & Trucking Accounting$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 6,
                'name' => 'MFI_CORTES_PIGGERY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 7,
                'name' => 'MFI_CORTES_POULTRY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 8,
                'name' => 'MFI - ICE PLANT$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 9,
                'name' => 'MFI SLAUGHTER HOUSE II$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 11,
                'name' => 'MPDI ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 12,
                'name' => 'NOODLES FACTORY ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 13,
                'name' => 'PRAWNFARM_ICM_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 14,
                'name' => 'SON-OK AGRI FARM$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 15,
                'name' => 'ALTA CITTA ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],

        ];

        DB::table('nav_servers')->insert($servers);
        DB::table('nav_databases')->insert($dbNames);
        DB::table('nav_tables')->insert($tables);
    }
}
