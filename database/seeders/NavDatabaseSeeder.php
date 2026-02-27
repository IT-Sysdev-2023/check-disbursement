<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         //INCOMPLETE
        $dbNames = [
            [
                'nav_server_id' => 1,
                'name' => 'CARMEN AGRI FARM',
                'business_unit_id' => 1,
                'module' => 'CRF',
                'created_at' => now(),
                'updated_at' => now()

            ],
            [
                'nav_server_id' => 1,
                'name' => 'CHOWKING_ALTACITTA_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'CORTES FERTILIZER PLANT_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DAO_WATER_PUMPING',
                'module' => 'CRF',
                'business_unit_id' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'DEL&TRUCK_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_PIGGERY_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 6,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_CORTES_POULTRY_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 7,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_ICEPLANT_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 8,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_SLAUGHTER_HOUSE_II',
                'module' => 'CRF',
                'business_unit_id' => 9,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MFI_TIPCAN_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 10,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'MPDI_ACCTG_SQL',
                'module' => 'CV',
                'business_unit_id' => 11,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'NOODLES_FACTORY_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 12,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'PRAWNFARM_ICM_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 13,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 1,
                'name' => 'SUN-OK AGRI FARM',
                'module' => 'CRF',
                'business_unit_id' => 14,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ALTA_CITTA_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 15,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ALTURAS GLASS SERVICE',
                'module' => 'CV',
                'business_unit_id' => 16,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'ASC_TECH_TAGBI',
                'module' => 'CV',
                'business_unit_id' => 17,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'GREENWICH ALTURAS SQL',
                'module' => 'CV',
                'business_unit_id' => 18,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE ALTA CITTA',
                'module' => 'CV',
                'business_unit_id' => 19,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE DRIVE THRU SQL',
                'module' => 'CV',
                'business_unit_id' => 20,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE PANGLAO',
                'module' => 'CV',
                'business_unit_id' => 21,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE PLAZA MARCELA',
                'module' => 'CV',
                'business_unit_id' => 22,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE_TALIBON_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 23,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'JOLLIBEE_TUBIGON_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 24,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'LDI_ACCTG_SQL',
                'module' => 'CV',
                'business_unit_id' => 25,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MANG_INASAL-ICM',
                'module' => 'CV',
                'business_unit_id' => 26,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MANG_INASAL-TALIBON',
                'module' => 'CV',
                'business_unit_id' => 27,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MEAL TIME EXPRESS ACCTG',
                'module' => 'CV',
                'business_unit_id' => 28,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'MFI_RICEMILL_ACCTG 2',
                'module' => 'CRF',
                'business_unit_id' => 29,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'NAUTICA_SHIPPING_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 30,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'NETMAN_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 31,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PANGLAO_FR_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 32,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PEANUTKISSES_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 33,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PHARMA_DC_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 34,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PLANNING_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 35,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PRAWN FARM ALTA CITTA ACCTG',
                'module' => 'CV',
                'business_unit_id' => 36,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'PRAWNFARM PANGLAO ACCTG',
                'module' => 'CV',
                'business_unit_id' => 37,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'RED RIBBON TUBIGON ACCTG',
                'module' => 'CV',
                'business_unit_id' => 38,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'RED_RIBBON_TALIBON_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 39,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 2,
                'name' => 'WDG_ACCTG_SQL',
                'module' => 'CV',
                'business_unit_id' => 40,
                'created_at' => now(),
                'updated_at' => now()
            ],

            //NEWEST ADDED
            [
                'nav_server_id' => 3,
                'name' => 'BAMDECOR_ACCTG_2021',
                'module' => 'CV',
                'business_unit_id' => 41,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 3,
                'name' => 'BAMDECOR_ACCTG_SQL',
                'module' => 'CV',
                'business_unit_id' => 42,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 3,
                'name' => 'MARCELA_BAMDECORP_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 43,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 4,
                'name' => 'BOHOL_MILKFISH_CORP_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 44,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'CATAGBACAN_FISHPOND_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 45,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'HEAVY_EQUIPMENT_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 46,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_BACONG_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 47,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_LABORATORY_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 48,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_MARIBOJOC_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 49,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_ORTIGAS_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 50,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_SLURRY_ICE_PLANT_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 51,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'MFI_TIPCAN_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 52,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 4,
                'name' => 'TILAPIA_HATCHERY_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 53,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 5,
                'name' => 'BILAR_BREEDER_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 54,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 5,
                'name' => 'BILAR_HATCHERY_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 55,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 5,
                'name' => 'DIMIAO_CANHAYUPON_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 56,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 5,
                'name' => 'GRANDPARENT JAGNA BREEDER',
                'module' => 'CRF',
                'business_unit_id' => 57,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 5,
                'name' => 'MFI_LAPSAON_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 58,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 5,
                'name' => 'RIZAL_BREEDER_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 59,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 6,
                'name' => 'ASC_MAIN_SQL',
                'module' => 'CV',
                'business_unit_id' => 60,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 6,
                'name' => 'ASC_TUBIGON_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 61,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 6,
                'name' => 'FIXRITE_TUBIGON_ACCTG',
                'module' => 'CV',
                'business_unit_id' => 62,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 6,
                'name' => 'FR_DC_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 63,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 6,
                'name' => 'HF_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 64,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 6,
                'name' => 'ICM_MAIN_SQL',
                'module' => 'CV',
                'business_unit_id' => 65,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 7,
                'name' => 'COMM COLD STORAGE ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 66,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'COMMI COMPOUND ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 67,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'COMM_MAIN',
                'module' => 'CRF',
                'business_unit_id' => 68,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'FOOD GROUP MGT ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 69,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'FR&D_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 70,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'FSCOMMISSARY_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 71,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'MFI_COMMQD_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 72,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'MFI_SLAUGHTER_HOUSE_I',
                'module' => 'CRF',
                'business_unit_id' => 73,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 7,
                'name' => 'PM_MAIN_SQL',
                'module' => 'CV',
                'business_unit_id' => 74,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 8,
                'name' => 'COPRA_BUYING_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 75,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'FARMERS_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 76,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI-FEEDMILL_ACCTG_SQL',
                'module' => 'CRF',
                'business_unit_id' => 77,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_BROILER_GROW-OUT_SQL',
                'module' => 'CRF',
                'business_unit_id' => 78,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_COLD_STORAGE_UBAY',
                'module' => 'CRF',
                'business_unit_id' => 79,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_DP_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 80,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_FERTILIZER_PLANT_SQL',
                'module' => 'CRF',
                'business_unit_id' => 81,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_MEAT_PROCESSING_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 82,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_RENDERING_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 83,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MFI_UNTAGA_PIGGERY_SQL',
                'module' => 'CRF',
                'business_unit_id' => 84,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MIC_COMPOUND_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 85,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MIC_LOGISTICS_SQL',
                'module' => 'CRF',
                'business_unit_id' => 86,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 8,
                'name' => 'MOTORPOOL_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 87,
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'nav_server_id' => 9,
                'name' => 'ACCTG_MOTORPOOL_SQL',
                'module' => 'CRF',
                'business_unit_id' => 88,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 10,
                'name' => 'MFI_REPACKING_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 89,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_server_id' => 11,
                'name' => 'MFI_RICEMILL_ACCTG',
                'module' => 'CRF',
                'business_unit_id' => 90,
                'created_at' => now(),
                'updated_at' => now()
            ],


        ];

        
        DB::table('nav_databases')->insert($dbNames);
    }
}
