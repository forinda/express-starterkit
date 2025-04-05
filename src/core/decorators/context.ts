/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { LoginAuthorityType } from '@/common/constants/permissions';
import { INextFunction, IRequest, IResponse } from '../interfaces/http';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface RouteOptions {
  paginate?: boolean;
  auth?: LoginAuthorityType;
}

export interface RequestContext<B = any, Q = any, P = any> {
  body: B;
  query: Q;
  params: P;
  pagination?: PaginationParams;
  user?: any;
  req: IRequest;
  res: IResponse;
  next: INextFunction;
}

export type ContextTransformer<B = any, Q = any, P = any> = (
  context: RequestContext<B, Q, P>
) => Promise<RequestContext<B, Q, P>>;

export type RouteHandlerContext<B = any, Q = any, P = any> = (
  context: RequestContext<B, Q, P>
) => Promise<any>;

export function createContextTransformer<B = any, Q = any, P = any>(
  transformer: ContextTransformer<B, Q, P>
): ContextTransformer<B, Q, P> {
  return transformer;
}

export async function withContext<B = any, Q = any, P = any>(
  req: IRequest,
  res: IResponse,
  next: INextFunction,
  handler: RouteHandlerContext<B, Q, P>,
  options?: RouteOptions
) {
  try {
    // Initialize context
    const context: RequestContext<B, Q, P> = {
      body: req.body as B,
      query: req.query as Q,
      params: req.params as P,
      req,
      res,
      next,
    };

    // Handle authentication if required
    if (options?.auth) {
      // TODO: Implement authentication logic
      // For now, just set a mock user
      context.user = { id: 1, name: 'Test User' };
    }

    // Handle pagination if required
    if (options?.paginate) {
      const { page = 1, limit = 10, sort, order = 'asc' } = req.query;
      context.pagination = {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order as 'asc' | 'desc',
      };
    }

    // Call the handler with the context
    const result = await handler(context);

    // Handle paginated response
    if (options?.paginate && Array.isArray(result)) {
      return res.json({
        data: result,
        pagination: context.pagination,
      });
    } else {
      return res.json(result);
    }
  } catch (error) {
    return next(error);
  }
}
