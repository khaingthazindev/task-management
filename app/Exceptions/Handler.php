<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
	/**
	 * A list of exception types with their corresponding custom log levels.
	 *
	 * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
	 */
	protected $levels = [
		//
	];

	/**
	 * A list of the exception types that are not reported.
	 *
	 * @var array<int, class-string<\Throwable>>
	 */
	protected $dontReport = [
		//
	];

	/**
	 * A list of the inputs that are never flashed to the session on validation exceptions.
	 *
	 * @var array<int, string>
	 */
	protected $dontFlash = [
		'current_password',
		'password',
		'password_confirmation',
	];

	/**
	 * Register the exception handling callbacks for the application.
	 */
	public function register(): void
	{
		$this->reportable(function (Throwable $e) {
			//
		});
	}

	public function render($request, Throwable $e)
	{
		if ($request->expectsJson()) {
			// validation error 
			if ($e instanceof ValidationException) {
				return response()->json([
					'success' => false,
					'message' => 'Validation error',
					'errors' => $e->errors(),
				], 422);
			}

			// not found
			if ($e instanceof ModelNotFoundException) {
				return response()->json([
					'success' => false,
					'message' => 'Resource not found',
				], 404);
			}

			// http error 
			if ($e instanceof HttpException) {
				return response()->json([
					'success' => false,
					'message' => $e->getMessage() ?: 'Request error',
				], $e->getStatusCode());
			}

			// default server error 
			return response()->json([
				'success' => false,
				'message' => 'Internal server error'
			], 500);
		}
		return parent::render($request, $e);
	}
}
