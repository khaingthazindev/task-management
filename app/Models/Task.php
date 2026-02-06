<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = [
		'project_id',
		'title',
		'description',
		'status',
		'due_date',
		'priority',
		'created_by',
		'updated_by',
		'deleted_by',
		'deleted_at',
	];

	public function project(): BelongsTo
	{
		return $this->belongsTo(Project::class);
	}
}
