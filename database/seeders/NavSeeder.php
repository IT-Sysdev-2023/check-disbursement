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
                'server' => '172.16.161.11',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.161.7',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.98.215',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.217.112',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.220.2',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.161.123',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.161.127',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.104.1',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.192.4',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.192.1',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
            [
                'server' => '172.16.105.11',
                'username' => 'super',
                'password' => 'fsasya1941',
                'port' => '1433',
            ],
        ];

        //INCOMPLETE
        $dbNames = [
            [
                'nav_server_id' => 1,
                'name' => 'CARMEN AGRI FARM',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'CHOWKING_ALTACITTA_ACCTG',
                'module' => 'CV',
                'company' => 'ROSE AND HONEY'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'CORTES FERTILIZER PLANT_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DAO_WATER_PUMPING',
                'module' => 'CRF',
                'company' => 'ASC'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DEL&TRUCK_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'ASC'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_PIGGERY_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_POULTRY_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_ICEPLANT_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_SLAUGHTER_HOUSE_II',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_TIPCAN_ACCTG',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MPDI_ACCTG_SQL',
                'module' => 'CV',
                'company' => 'MPDI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'NOODLES_FACTORY_ACCTG_SQL',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'PRAWNFARM_ICM_ACCTG',
                'module' => 'CV',
                'company' => 'MFI'
            ],
            [
                'nav_server_id' => 1,
                'name' => 'SUN-OK AGRI FARM',
                'module' => 'CRF',
                'company' => 'MFI'
            ],
        ];

        $tables = [
            [
                'nav_db_name' => 1,
                'name' => 'CARMEN AGRI FARM$CRF Header'
            ]
        ];

        DB::table('nav_servers')->insert($servers);
        DB::table('nav_databases')->insert($dbNames);
    }
}
