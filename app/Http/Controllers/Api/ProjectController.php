<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectDetailResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();
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
        return ProjectResource::collection($query->paginate(config('app.pagination')))->additional([
            'success' => true,
            'message' => 'Success',
        ]);
    }

    public function getAllprojects(Request $request)
    {
        $query = project::query();
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
        $data = ProjectResource::collection(
            $filtered_data
        );
        return ApiResponse::success($data);
    }

    public function store(StoreProjectRequest $request)
    {
        try {
            $data = $request->validated();
            $data = $request->all();
            $project = project::create([
                ...$data,
                'created_by' => auth()->user()->id
            ]);
            $project = project::find($project->id);

            $tasks = $request->tasks;
            foreach ($tasks as $task) {
                $task = Task::create([
                    ...$task,
                    'project_id' => $project->id,
                    'created_by' => auth()->user()->id
                ]);
            }
            $project = Project::with('tasks')->find($project->id);
            $data = ProjectDetailResource::make($project);

            return ApiResponse::success([], 'Success', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }
    }

    public function show(Project $project)
    {
        $project = Project::with('tasks')->find($project->id);
        $data = ProjectDetailResource::make($project);
        return ApiResponse::success($data);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        DB::beginTransaction();
        try {
            $request->validated();
            $data = $request->all();
            $data['updated_by'] = auth()->user()->id;
            $data['updated_at'] = now();
            $project->update($data);

            $tasks = $request->tasks;
            $task_ids = [];
            foreach ($tasks as $task) {
                $task = Task::create([
                    ...$task,
                    'project_id' => $project->id,
                    'created_by' => auth()->user()->id
                ]);
                $task_ids = [...$task_ids, $task->id];
            }
            $project->tasks()
                ->whereNotIn('id', $task_ids)
                ->delete();
            DB::commit();

            $project = Project::with('tasks')->find($project->id);
            $data = ProjectDetailResource::make($project);

            return ApiResponse::success($data);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Something went wrong.', 400, $e->getMessage());
        }
        // if ($request->user()->id !== $project->created_by) {
        //     return ApiResponse::error('You are not authorized to update this project', 403);
        // }
    }

    public function destroy(project $project)
    {
        $project->delete();
        return ApiResponse::success([], 'Success', 204);
    }

    public function updateStatus(Request $request, project $project)
    {
        if ($request->user()->id !== $project->created_by) {
            return ApiResponse::error('You are not authorized to update this project', 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['to-do', 'in-progress', 'done'])
            ],
        ]);
        $project->status = $validated['status'];
        $project->save();
        $data = ProjectResource::make($project);

        return ApiResponse::success($data);
    }

    public function updatePriority(Request $request, project $project)
    {
        if ($request->user()->id !== $project->created_by) {
            return ApiResponse::error('You are not authorized to update this project', 403);
        }

        $validated = $request->validate([
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high'])
            ],
        ]);
        $project->priority = $validated['priority'];
        $project->save();
        $data = ProjectResource::make($project);

        return ApiResponse::success($data);
    }

    public function updateDueDate(Request $request, project $project)
    {
        if ($request->user()->id !== $project->created_by) {
            return ApiResponse::error('You are not authorized to update this project', 403);
        }

        $validated = $request->validate([
            'due_date' => [
                'required',
                'date_format:Y-m-d H:i:s'
            ],
        ]);
        $project->due_date = $validated['due_date'];
        $project->save();
        $data = ProjectResource::make($project);

        return ApiResponse::success($data);
    }
}
