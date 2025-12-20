<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class TaskResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'title' => $this->title,
			// 'description' => Str::limit($this->description, 70),
			'status' => $this->status,
			'due_date' => $this->due_date,
			'priority' => $this->priority,
			// 'created_by' => $this->created_by,
			// 'updated_by' => $this->updated_by,
			// 'deleted_by' => $this->deleted_by,
			// 'created_at' => $this->created_at,
			// 'updated_at' => $this->updated_at,
		];
	}
}
