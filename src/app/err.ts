/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { ApiError } from '@/common/error/api-error';
import { formatResponse } from '@/common/formatter/response';
import { LoggerService } from '@/common/logger';
import { Application, Request, Response, NextFunction } from 'express';
import { ConfigService } from '@/common/config';

/**
 * Setup error handling middleware
 * @param app Express application
 * @param logger Logger service
 */
export function setupErrorHandling(app: Application, logger: LoggerService): void {
  const configService = new ConfigService();
  const isDevelopment = configService.isDevelopment();

  // 404 handler
  app.use((req: Request, res: Response) => {
    logger.warn('ErrorHandler', `404 Not Found: ${req.method} ${req.path}`);
    return formatResponse(res, {
      status: 'error',
      message: 'Not Found',
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('ErrorHandler', `Unhandled error: ${err.message}`);
    if (err instanceof ApiError) {
      const { stack, extra } = err.toJSON();
      return formatResponse(res, {
        status: 'error',
        message: err.message,
        data: isDevelopment ? { stack, ...extra } : {},
      });
    }

    const apiError = ApiError.fromError(err);
    return formatResponse(res, {
      status: 'error',
      message: 'Internal Server Error',
      data: {
        ...apiError.toJSON(),
        ...(isDevelopment ? { stack: err.stack } : {}),
      },
    });
  });
}
