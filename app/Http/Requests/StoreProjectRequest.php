<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		$statuses = ['draft', 'active', 'completed', 'archived'];
		return [
			'title' => 'required|string',
			'status' => ['nullable', Rule::in($statuses)],
			'due_date' => 'nullable|date_format:Y-m-d H:i:s'
		];
	}
}
