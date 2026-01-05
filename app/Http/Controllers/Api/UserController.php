<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
	public function index()
	{
		// I can't use response()->json() it can lost LengthAwarePaginator 
		$filtered_data = User::query()->orderBy('id', 'desc')->paginate(perPage: config('app.pagination'));
		return UserResource::collection($filtered_data)->additional([
			'success' => true,
			'message' => 'Success',
		]);
	}

	public function store(StoreUserRequest $request)
	{
		$data = $request->validated();
		$data['password'] = bcrypt($data['password']);
		$user = User::create($data);
		return response()->json(new UserResource($user), 201);
	}

	public function show(User $user)
	{
		return response($user);
	}

	public function update(UpdateUserRequest $request, User $user)
	{
		$data = $request->validated();
		if (isset($data['password'])) {
			$data['password'] = bcrypt($data['password']);
		}
		$user->update($data);
	}

	public function destroy(User $user)
	{
		$user->delete();
		return response("", 204);
	}
}
