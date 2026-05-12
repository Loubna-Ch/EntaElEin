import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(
      {
        code,
        message,
        details,
      },
      statusCode,
    );
  }

  static badRequest(message: string, details: Record<string, unknown> = {}) {
    return new ApiError(
      HttpStatus.BAD_REQUEST,
      'BAD_REQUEST',
      message,
      details,
    );
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(HttpStatus.FORBIDDEN, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(HttpStatus.NOT_FOUND, 'NOT_FOUND', message);
  }

  static conflict(message: string, details: Record<string, unknown> = {}) {
    return new ApiError(HttpStatus.CONFLICT, 'CONFLICT', message, details);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      message,
    );
  }
}
