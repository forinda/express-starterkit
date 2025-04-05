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
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
      status: 'error',
      message: 'Not Found',
    });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', err);

    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  });
}
