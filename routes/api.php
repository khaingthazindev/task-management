<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;

Route::middleware('auth:sanctum')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::get('/user', function (Request $request) {
		return $request->user();
	});

	Route::apiResource('/users', UserController::class);

	Route::apiResource('/projects', ProjectController::class);

	Route::apiResource('/tasks', TaskController::class);
	Route::get('/admin/tasks', [TaskController::class, 'getAllTasks']);
	Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
	Route::put('/tasks/{task}/priority', [TaskController::class, 'updatePriority']);
	Route::put('/tasks/{task}/due-date', [TaskController::class, 'updateDueDate']);

	Route::get('/check-sidebar-permissions', function () {
		return [
			'userMenu' => Gate::allows('view-user-menu'),
		];
	});
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
