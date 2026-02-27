<?php

namespace Database\Seeders;

use App\Models\NavDatabase;
use App\Models\NavServer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavServerSeeder extends Seeder
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

       


        // NavServer::create($servers);
        DB::table('nav_servers')->insert($servers);
        // NavDatabase::create($dbNames);
    }
}
