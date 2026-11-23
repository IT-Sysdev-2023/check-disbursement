<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusinessUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       

        $bu = [
            [
                'company_id' => 2,
                'name' => "CARMEN AGRI FARM",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 5,
                'name' => "CHOWKING- ALTA CITTA",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "CORTES FERTILIZER PLANT",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 1,
                'name' => "DAO WATER PUMPING",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 1,
                'name' => "DEL & TRUCK",
                'code' => 'BR-TRUCK',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "MFI PIGGERY (CORTES)",
                'code' => 'BU-PIG',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "MFI POULTRY (CORTES)",
                'code' => 'BU-POUL',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "ICE PLANT",
                'code' => 'BU-ICE1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "MFI Slaughterhouse II",
                'code' => 'BU-SLA',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "TIPCAN FARMS",
                'code' => 'BU-TIP',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 10,
                'name' => "MPDI",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "NOODLES FACTORY",
                'code' => 'BU-NOOD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "THE PRAWN FARM (ICM)",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 2,
                'name' => "SUN-OK AGRI FARM",
                'created_at' => now(),
                'updated_at' => now(),
            ],


            [
                'company_id' => 1,
                'name' => "ALTA CITTA",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 1,
                'name' => "ALTURAS GLASS SERVICE",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 1,
                'name' => "ASC TECH TAGBI",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 5,
                'name' => "GREENWICH ALTURAS",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 9,
                'name' => "JOLLIBEE ALTA CITTA",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 9,
                'name' => "JOLLIBEE DRIVE THRU",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 9,
                'name' => "JOLLIBEE PANGLAO",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 5,
                'name' => "JOLLIBEE PLAZA MARCELA",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 6,
                'name' => "JOLLIBEE TALIBON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 6,
                'name' => "JOLLIBEE TUBIGON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'company_id' => 3,
                'name' => "LDI",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 8,
                'name' => "MANG INASAL -ICM",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 8,
                'name' => "MANG INASAL -TALIBON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 8,
                'name' => "MEAL TIME EXPRESS",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "RICE MILL",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 7,
                'name' => "NAUTICA SHIPPING",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 12,
                'name' => "NETMAN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "PANGLAO FIXRITE",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 4,
                'name' => "PEANUTKISSES",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "PHARMA DC",
                'code' => 'BU-PDC',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "PLANNING",
                'code' => 'BU-CONST',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 8,
                'name' => "PRAWN FARM ALTA CITTA",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 9,
                'name' => "PRAWNFARM PANGLAO",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 6,
                'name' => "RED RIBBON TUBIGON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 6,
                'name' => "RED RIBBON TALIBON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "WDG",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 11,
                'name' => "BAMDECOR 2021",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 11,
                'name' => "BAMDECOR",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 11,
                'name' => "MARCELA BAMDECORP",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "BOHOL MILKFISH CORP",
                'code' => 'BU-MILK',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "CATAGBACAN FISHPOND",
                'code' => 'BU-CAT',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "HEAVY EQUIPMENT",
                'code' => 'BR-HEAVY',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI BACONG",
                'code' => 'BU-BAC',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI LABORATORY",
                'code' => 'BU-LAB',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI MARIBOJOC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI ORTIGAS",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI SLURRY ICE PLANT",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI TIPCAN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "TILAPIA HATCHERY",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "BILAR BREEDER",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "BILAR HATCHERY",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "DIMIAO CANHAYUPON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "GRANDPARENT JAGNA BREEDER",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI LAPSAON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "RIZAL BREEDER",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "ASC MAIN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "ASC TUBIGON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "FIXRITE TUBIGON",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "FR DC",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "ASC HOME AND FASHION",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "ICM MAIN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "COMM COLD STORAGE",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "COMMISSARY COMPOUND",
                'code' => 'BU-COM2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "COMMISSARY MAIN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "FOOD GROUP MGT",
                'code' => 'BU-FGM',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "FR&D",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "FSCOMMISSARY",
                'code' => 'BU-COM4',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI COMMQD",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI SLAUGHTER HOUSE I",
                'code' => 'BU-SLA1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "PM MAIN",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "COPRA BUYING",
                'code' => 'BU-COPRA',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "FARMERS",
                'code' => 'BU-FARM',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI FEEDMILL",
                'code' => 'BU-FEED1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI BROILER GROW-OUT",
                'code' => 'BU-BRO2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI COLD STORAGE UBAY",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI DP",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI FERTILIZER PLANT",
                'code' => 'BU-FER',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI MEAT PROCESSING",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI RENDERING",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI UNTAGA PIGGERY",
                'code' => 'BU-PIG2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MIC COMPOUND",
                'code' => 'BU-MIC1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MIC LOGISTICS",
                'code' => 'BU-MIC3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MOTORPOOL",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 1,
                'name' => "MOTORPOOL",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI REPACKING",
                'code' => 'BU-CURLS',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 2,
                'name' => "MFI RICEMILL",
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'company_id' => 13,
                'name' => "HEAD OFFICE",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

         BusinessUnit::insert($bu);
    }
     //11 Rose and Honey *
        //3 MFI *
        //22 MPDI *
        //2 ASC *
        //19 ROAST AND TOAST *
        //12 CRUST & PEPPER *
        //6 LDI *
        //18 CHARCOAL  & CHOP *
        //16 NAUTICA *
        //15 NDI
        //9 BUCAREZ *
}
