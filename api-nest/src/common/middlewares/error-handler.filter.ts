import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from './api-error';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (exception instanceof ApiError) {
      res.status(exception.statusCode).json({
        code: exception.code,
        message: exception.message,
        details: exception.details,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : ((payload as { message?: string | string[] }).message ??
            exception.message);

      res.status(statusCode).json({
        code: this.statusToCode(statusCode),
        message,
        details: {},
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    this.logger.error(
      `Unexpected error on ${req.method} ${req.originalUrl}`,
      exception as Error,
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: {},
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  private statusToCode(statusCode: number): string {
    const map: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
    };

    return map[statusCode] ?? 'HTTP_ERROR';
  }
}
