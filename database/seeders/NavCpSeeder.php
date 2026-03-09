<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavCpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         //Unfinished
         $cp = [
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
                'nav_database_id' => 10, //Not Exist
                'name' => 'MFI_TIPCAN_ACCTG$CV Check Payment',
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

            //STARTING HERE
            [
                'nav_database_id' => 16,
                'name' => 'ALTURAS GLASS SERVICE$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 17,
                'name' => 'ASC TECH TAGB ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 18,
                'name' => 'GREENWICH ALTURAS$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 19,
                'name' => 'JOLLIBEE - ALTA CITTA$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 20,
                'name' => 'JOLLIBEE - CPG DRIVE THRU$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 21,
                'name' => 'JOLLIBEE - PANGLAO$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 22,
                'name' => 'JOLLIBEE - PLAZA MARCELA$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 23,
                'name' => 'JOLLIBEE - TALIBON$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 24,
                'name' => 'JOLLIBEE - TUBIGON$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 25,
                'name' => 'LDI-DSG 2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 26,
                'name' => 'MANG INASAL-ICM$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 27,
                'name' => 'MANG INASAL-TALIBON$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 28, //NOT EXIST
                'name' => 'MEALTIME EXPRESS ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 29,
                'name' => 'MFI_RICEMILL_ACCTG 2$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 30,
                'name' => 'NAUTICA SHIPPING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 31,
                'name' => 'NETMAN ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 32,
                'name' => 'FIXRITE PANGLAO ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 33,
                'name' => 'BUCAREZ - PEANUT KISSES$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 34,
                'name' => 'PHARMA DC 2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 35,
                'name' => 'PLANNING & CONSTRUCTION ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 36,
                'name' => 'PRAWN FARM ALTA CITTA ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 37,
                'name' => 'PRAWNFARM PANGLAO ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 38,
                'name' => 'RED RIBBON - TUBIGON$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 39,
                'name' => 'RED RIBBON - TALIBON$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 40,
                'name' => 'LDI-WDG-2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 41,
                'name' => 'BAMDECOR 2021$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 42,
                'name' => 'BAMDECOR$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 43,
                'name' => 'MARCELA BAMDECOR$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 44,
                'name' => 'BOHOL_MILKFISH_CORP_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 45,
                'name' => 'CATAGBACAN_FISHPOND_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 46,
                'name' => 'Heavy & Equipment Accounting$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 47,
                'name' => 'MFI_BACONG_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 48,
                'name' => 'MFI_LABORATORY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 49,
                'name' => 'MFI_MARIBOJOC_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 50,
                'name' => 'MFI - ORTIGAS FARM$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 51,
                'name' => 'MFI_SLURRY_ICE_PLANT_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 52,
                'name' => 'MFI_TIPCAN_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 53,
                'name' => 'TILAPIA_HATCHERY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 54,
                'name' => 'BILAR_BREEDER_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 55,
                'name' => 'BILAR_HATCHERY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 56,
                'name' => 'DIMIAO CANYAHUPON BREEDER ACCT$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 57,
                'name' => 'GRANDPARENT JAGNA BREEDER$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 58,
                'name' => 'MFI LAPSAON ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 59,
                'name' => 'RIZAL_BREEDER_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 60,
                'name' => 'ASC_MAIN_2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 61,
                'name' => 'ASC TUBIGON ACCTG 2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 62,
                'name' => 'FIXRITE_TUBIGON_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 63,
                'name' => 'FR_DC_ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 64,
                'name' => 'ASC - HOME AND FASHION$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 65,
                'name' => 'ICM MAIN-2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 66,
                'name' => 'COMMI-COLD STORAGE ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 67,
                'name' => 'COMMISSARY COMPOUND$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 68,
                'name' => 'MFI - BS COMMISSARY MAIN$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 69,
                'name' => 'FOOD GROUP MANAGEMENT$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 70,
                'name' => 'AGC Center for FSQ_FRD$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 71,
                'name' => 'FSCOMMISSARY ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 72,
                'name' => 'MFI-COMM FSQD$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 73,
                'name' => 'MFI SLAUGHTER HOUSE I$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 74,
                'name' => 'Plaza Marcela MAIN-2019$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 75,
                'name' => 'MFI COPRA BUYING STATION$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 76,
                'name' => 'MFI FARMERS MARKET$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 77,
                'name' => 'MFI-FEEDMILL_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 78,
                'name' => 'MFI-BROILER_GROW-OUT_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 79,
                'name' => 'MFI COLD STORAGE-UBAY$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 80,
                'name' => 'MFI DP ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 81,
                'name' => 'MFI - FERTILIZER_PLANT_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 82,
                'name' => 'MFI MEAT PROCESSING ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 83,
                'name' => 'MFI RENDERING PLANT$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 84,
                'name' => 'MFI-UNTAGA_PIGGERY_ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 85,
                'name' => 'MIC COMPOUND$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 86,
                'name' => 'MIC LOGISTICS$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 87,
                'name' => 'UBAY MOTORPOOL ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 88,
                'name' => 'MOTORPOOL ACCTG$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 89,
                'name' => 'MFI REPACKING ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nav_database_id' => 90,
                'name' => 'MFI RICEMILL ACCOUNTING$CV Check Payment',
                'created_at' => now(),
                'updated_at' => now()
            ],

        ];

        DB::table('nav_check_payment_tables')->insert($cp);
    }
}
