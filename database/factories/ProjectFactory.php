<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class ProjectFactory extends Factory
{
    protected $model = \App\Models\Project::class;

    public function definition()
    {
        $statuses = ['draft', 'active', 'completed', 'archived'];
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement($statuses),
            'created_by' => 1,
        ];
    }
}
