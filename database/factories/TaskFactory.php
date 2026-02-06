<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;

class TaskFactory extends Factory
{
    protected $model = \App\Models\Task::class;

    public function definition()
    {
        $statuses = ['to-do', 'in-progress', 'done'];
        $priorities = ['low', 'medium', 'high'];

        return [
            'project_id' => $this->faker->numberBetween(1, 10),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement($statuses),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'priority' => $this->faker->randomElement($priorities),
            'created_by' => User::factory(),
        ];
    }
}
