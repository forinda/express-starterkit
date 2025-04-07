/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import {
  ApiRequestContext,
  INextFunction,
  IRequest,
  IResponse,
  MethodProps,
} from '../context/request';

export type ContextTransformer<B = any, Q = any, P = any> = (
  context: ApiRequestContext<B, Q, P>
) => Promise<ApiRequestContext<B, Q, P>>;

export type RouteHandlerContext<B = any, Q = any, P = any> = (
  context: ApiRequestContext<B, Q, P>
) => Promise<any>;

export function createContextTransformer<B = any, Q = any, P = any>(
  transformer: ContextTransformer<B, Q, P>
): ContextTransformer<B, Q, P> {
  return transformer;
}

export async function transformToContext<B = any, Q = any, P = any>(
  req: IRequest,
  res: IResponse,
  next: INextFunction,
  handler: RouteHandlerContext<B, Q, P>,
  options?: MethodProps<B, Q, P>
) {
  try {
    // Initialize context
    let context: ApiRequestContext<B, Q, P> = {
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

    if (options?.transformer) {
      context = await options.transformer(context);
    }

    if (options?.bodySchema) {
      context.body = options.bodySchema.parse(context.body);
    }

    if (options?.querySchema) {
      context.query = options.querySchema.parse(context.query);
    }

    if (options?.paramSchema) {
      context.params = options.paramSchema.parse(context.params);
    }
    // Handle request
    const result = await handler(context);
    return result;
  } catch (error) {
    return next(error);
  }
}
