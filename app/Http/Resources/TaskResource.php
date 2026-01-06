<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class TaskResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'title' => $this->title,
			'description' => $this->description,
			'status' => $this->status,
			'due_date' => $this->due_date,
			'priority' => $this->priority,
			'created_by' => User::find($this->created_by)->name ?? $this->created_by,
			'updated_by' => User::find($this->updated_by)->name ?? $this->updated_by,
			'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
			'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d'),
		];
	}
}
