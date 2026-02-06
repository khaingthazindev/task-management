<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'status',
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at'
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
