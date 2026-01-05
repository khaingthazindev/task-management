<?php

namespace App\Http\Resources;

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
			'status' => $this->status,
			'due_date' => $this->due_date,
			'priority' => $this->priority,
			'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
		];
	}
}
