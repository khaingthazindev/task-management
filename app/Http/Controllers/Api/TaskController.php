<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskDetailResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
	public function index(Request $request)
	{
		$query = Task::query();
		$query = $query->where('created_by', $request->user()->id)
			->when($request->filled('search'), function ($q) use ($request) {
				$q->where(function ($q2) use ($request) {
					$q2->where('title', 'like', "%{$request->search}%")
						->orWhere('description', 'like', "%{$request->search}%");
				});
			})
			->when($request->filled('status'), function ($q) use ($request) {
				$status = explode(',', $request->status);
				$q->whereIn('status', $status);
			})
			->when($request->filled('priority'), function ($q) use ($request) {
				$priority = explode(',', $request->priority);
				$q->whereIn('priority', $priority);
			})
			->when($request->filled('due_date'), function ($q) use ($request) {
				$q->whereDate('due_date', $request->due_date);
			})
			->when($request->filled('order_by_id'), function ($q) use ($request) {
				if ($request->order_by_id === "-1") {
					$q->orderBy('id', 'desc');
				}
			});
		return TaskResource::collection($query->paginate(config('app.pagination')))->additional([
			'success' => true,
			'message' => 'Success',
		]);
	}

	public function getAllTasks(Request $request)
	{
		$query = Task::query();
		if ($request->has('title')) {
			$query->where('title', 'like', '%' . $request->title . '%');
		}
		if ($request->has('status')) {
			$query->where('status', $request->status);
		}
		if ($request->has('priority')) {
			$query->where('priority', $request->priority);
		}
		if ($request->has('due_date')) {
			$query->whereDate('due_date', $request->due_date);
		}
		if ($request->has('order_by_id')) {
			if ($request->order_by_id === -1) {
				$query->orderBy('id', 'desc');
			}
		}
		$filtered_data = $query->paginate(config('app.pagination'));
		$data = TaskResource::collection(
			$filtered_data
		);
		return ApiResponse::success($data);
	}

	public function store(StoreTaskRequest $request)
	{
		try {
			$data = $request->validated();
			$data = $request->all();
			$task = Task::create([
				...$data,
				'created_by' => auth()->user()->id
			]);
			$task = Task::find($task->id);
			$data = new TaskResource($task);

			return ApiResponse::success([], 'Success', 201);
		} catch (\Exception $e) {
			return ApiResponse::error($e->getMessage());
		}
	}

	public function show(Task $task)
	{
		$data = TaskDetailResource::make($task);
		return ApiResponse::success($data);
	}

	public function update(UpdateTaskRequest $request, Task $task)
	{
		if ($request->user()->id !== $task->created_by) {
			return ApiResponse::error('You are not authorized to update this task', 403);
		}

		$request->validated();
		$data = $request->all();
		$data['updated_by'] = auth()->user()->id;
		$task->update($data);
		$task = Task::find($task->id);
		$data = TaskDetailResource::make($task);

		return ApiResponse::success($data);
	}

	public function destroy(Task $task)
	{
		$task->delete();
		return ApiResponse::success([], 'Success', 204);
	}

	public function updateStatus(Request $request, Task $task)
	{
		if ($request->user()->id !== $task->created_by) {
			return ApiResponse::error('You are not authorized to update this task', 403);
		}

		$validated = $request->validate([
			'status' => [
				'required',
				Rule::in(['to-do', 'in-progress', 'done'])
			],
		]);
		$task->status = $validated['status'];
		$task->save();
		$data = TaskResource::make($task);

		return ApiResponse::success($data);
	}

	public function updatePriority(Request $request, Task $task)
	{
		if ($request->user()->id !== $task->created_by) {
			return ApiResponse::error('You are not authorized to update this task', 403);
		}

		$validated = $request->validate([
			'priority' => [
				'required',
				Rule::in(['low', 'medium', 'high'])
			],
		]);
		$task->priority = $validated['priority'];
		$task->save();
		$data = TaskResource::make($task);

		return ApiResponse::success($data);
	}

	public function updateDueDate(Request $request, Task $task)
	{
		if ($request->user()->id !== $task->created_by) {
			return ApiResponse::error('You are not authorized to update this task', 403);
		}

		$validated = $request->validate([
			'due_date' => [
				'required',
				'date_format:Y-m-d H:i:s'
			],
		]);
		$task->due_date = $validated['due_date'];
		$task->save();
		$data = TaskResource::make($task);

		return ApiResponse::success($data);
	}
}
