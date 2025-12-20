<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskDetailResource;

use App\Models\Task;

use Illuminate\Http\Request;

class TaskController extends Controller
{
	public function index()
	{
		$data = TaskResource::collection(
			Task::query()->orderBy('id', 'desc')->paginate(10)
		);
		return ApiResponse::success($data);
	}

	//  public function store(StoreUserRequest $request)
	//  {
	//      $data = $request->validated();
	//      $data['password'] = bcrypt($data['password']);
	//      $user = User::create($data);
	//      return response()->json(new UserResource($user), 201);
	//  }

	public function show(Task $task)
	{
		$data = TaskDetailResource::make($task);
		return ApiResponse::success($data);
	}

	//  public function update(UpdateUserRequest $request, User $user)
	//  {
	//      $data = $request->validated();
	//      if (isset($data['password'])) {
	//          $data['password'] = bcrypt($data['password']);
	//      }
	//      $user->update($data);
	//  }

	//  public function destroy(User $user)
	//  {
	//      $user->delete();
	//      return response("", 204);
	//  }
}
