<?php

namespace Database\Seeders;

use App\Models\Bank;
use App\Models\BankAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bank::insert([
            ['name' => 'Philippine National Bank', 'acronym' => 'PNB', 'caused_by' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Banko De Oro', 'acronym' => 'BDO', 'caused_by' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Banko Sentral ng Pilipinas', 'acronym' => 'BSP', 'caused_by' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bank of the Philippine Island', 'acronym' => 'BPI', 'caused_by' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        BankAccount::insert([
            ['account_no' => '568438', 'name' => 'Bank Account 1', 'bank_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['account_no' => '321244', 'name' => 'Bank Account 2', 'bank_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['account_no' => '674656', 'name' => 'Bank Account 3', 'bank_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['account_no' => '242343', 'name' => 'Bank Account 4', 'bank_id' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
