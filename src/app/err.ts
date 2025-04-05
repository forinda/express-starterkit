/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { ApiError } from '@/common/error/api-error';
import { LoggerService } from '@/common/logger';
import { Application, Request, Response, NextFunction } from 'express';

/**
 * Setup error handling middleware
 * @param app Express application
 * @param logger Logger service
 */
export function setupErrorHandling(app: Application, logger: LoggerService): void {
  // 404 handler
  app.use((req: Request, res: Response) => {
    logger.warn('ErrorHandler', `404 Not Found: ${req.method} ${req.path}`);
    return res.status(404).json({
      status: 'error',
      message: 'Not Found',
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('ErrorHandler', `Unhandled error: ${err.message}`);
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err.toJSON());
    }

    return res.status(500).json(ApiError.fromError(err).toJSON());
  });
}
