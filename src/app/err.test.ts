/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi } from 'vitest';
import { setupErrorHandling } from './err';
import { Application } from 'express';
import { LoggerService } from '@/common/logger';
import { ApiError } from '@/common/error/api-error';

describe('Error Handler', () => {
  const mockApp = {
    use: vi.fn(),
  } as unknown as Application;

  const mockLogger = {
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  it('should setup 404 handler', () => {
    setupErrorHandling(mockApp, mockLogger);
    expect(mockApp.use).toHaveBeenCalled();
  });

  it('should handle ApiError correctly', () => {
    const error = new ApiError('Test error', 400);
    const mockReq = {} as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const mockNext = vi.fn();

    setupErrorHandling(mockApp, mockLogger);
    const errorHandler = (mockApp.use as any).mock.calls[1][0];
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(error.toJSON());
  });

  it('should handle generic errors correctly', () => {
    const error = new Error('Test error');
    const mockReq = {} as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;
    const mockNext = vi.fn();

    setupErrorHandling(mockApp, mockLogger);
    const errorHandler = (mockApp.use as any).mock.calls[1][0];
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
