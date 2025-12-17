<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Knur',
            'email' => 'knur@gmail.com',
            'password' => bcrypt('password')
        ]);

        User::factory()->count(100)->create();
    }
}
