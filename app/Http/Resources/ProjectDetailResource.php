<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'tasks' => TaskResource::collection($this->tasks),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
