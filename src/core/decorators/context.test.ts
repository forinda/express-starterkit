/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { transformToContext, createContextTransformer } from './context';

describe('Context System', () => {
  describe('withContext', () => {
    it('should handle basic context without options', async () => {
      const mockReq = {
        body: { name: 'Test' },
        query: { id: '1' },
        params: { userId: '123' },
        cookies: {},
        signedCookies: {},
        get: vi.fn(),
        header: vi.fn(),
      } as unknown as Request;
      const mockRes = {
        json: vi.fn(),
      } as unknown as Response;
      const mockNext = vi.fn() as unknown as NextFunction;

      const handler = vi.fn().mockResolvedValue({ success: true });

      await transformToContext(mockReq, mockRes, mockNext, handler);

      expect(handler).toHaveBeenCalledWith({
        body: { name: 'Test' },
        query: { id: '1' },
        params: { userId: '123' },
        req: mockReq,
        res: mockRes,
        next: mockNext,
      });
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle pagination when enabled', async () => {
      const mockReq = {
        body: {},
        query: { page: '2', limit: '20', sort: 'name', order: 'desc' },
        params: {},
        cookies: {},
        signedCookies: {},
        get: vi.fn(),
        header: vi.fn(),
      } as unknown as Request;
      const mockRes = {
        json: vi.fn(),
      } as unknown as Response;
      const mockNext = vi.fn() as unknown as NextFunction;

      const handler = vi.fn().mockResolvedValue([1, 2, 3]);

      await transformToContext(mockReq, mockRes, mockNext, handler, { paginate: true });

      expect(handler).toHaveBeenCalledWith({
        body: {},
        query: { page: '2', limit: '20', sort: 'name', order: 'desc' },
        params: {},
        pagination: {
          page: 2,
          limit: 20,
          sort: 'name',
          order: 'desc',
        },
        req: mockReq,
        res: mockRes,
        next: mockNext,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        data: [1, 2, 3],
        pagination: {
          page: 2,
          limit: 20,
          sort: 'name',
          order: 'desc',
        },
      });
    });

    it('should handle authentication when enabled', async () => {
      const mockReq = {
        body: {},
        query: {},
        params: {},
        cookies: {},
        signedCookies: {},
        get: vi.fn(),
        header: vi.fn(),
      } as unknown as Request;
      const mockRes = {
        json: vi.fn(),
      } as unknown as Response;
      const mockNext = vi.fn() as unknown as NextFunction;

      const handler = vi.fn().mockResolvedValue({ success: true });

      await transformToContext(mockReq, mockRes, mockNext, handler, { auth: true });

      expect(handler).toHaveBeenCalledWith({
        body: {},
        query: {},
        params: {},
        user: { id: 1, name: 'Test User' },
        req: mockReq,
        res: mockRes,
        next: mockNext,
      });
    });

    it('should handle errors', async () => {
      const mockReq = {
        cookies: {},
        signedCookies: {},
        get: vi.fn(),
        header: vi.fn(),
      } as unknown as Request;
      const mockRes = {} as Response;
      const mockNext = vi.fn() as unknown as NextFunction;

      const error = new Error('Test error');
      const handler = vi.fn().mockRejectedValue(error);

      await transformToContext(mockReq, mockRes, mockNext, handler);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createContextTransformer', () => {
    it('should create a transformer function', () => {
      const transformer = createContextTransformer(async context => {
        context.body.name = context.body.name.toUpperCase();
        return context;
      });

      expect(typeof transformer).toBe('function');
    });
  });
});
