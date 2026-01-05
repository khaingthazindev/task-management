<?php

namespace App\Helpers;

use App\Http\Resources\TaskResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ApiResponse
{
	public static function success($data = null, $message = 'Success', $status = 200)
	{
		return response()->json([
			'success' => true,
			'message' => $message,
			'data'    => $data,
		], $status);
	}

	public static function error($message = 'Error', $status = 400, $errors = null)
	{
		return response()->json([
			'success' => false,
			'message' => $message,
			'errors' => $errors,
		], $status);
	}
}
