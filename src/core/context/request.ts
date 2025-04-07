/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { NextFunction, Response, Request } from 'express';
import { ContextTransformer } from '../decorators/context';
import { z } from 'zod';
import { LoginAuthorityType } from '@/common/constants/permissions';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface IResponse extends Response {}
export interface IRequest extends Request {
  user?: {
    id: number;
    name: string;
    roles?: string[];
    organizationId?: string;
  };
}
export interface INextFunction extends NextFunction {}
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface MethodProps<B = any, Q = any, P = any> {
  injectIpInBody?: boolean;
  pathParamTransform?: {
    [key: string]: string;
  };
  audit?: (context: ApiRequestContext) => ApiRequestContext;
  transformer?: ContextTransformer<B, Q, P>;
  paginate?: boolean;
  auth?: LoginAuthorityType;
  paramSchema?: z.ZodType<P>;
  querySchema?: z.ZodType<Q>;
  bodySchema?: z.ZodType<B>;
  middlewares?: any[];
}

export interface LoginAuthorityOption {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface ApiRequestContext<
  B = Record<string, any>,
  Q = Record<string, any>,
  P = Record<string, any>,
> {
  req: IRequest;
  res: IResponse;
  next: INextFunction;
  params: P;
  query: Q;
  body: B;
  pagination?: PaginationParams;
  user?: any;
  request_id?: string;
}

export class ExpressRequestContext implements ApiRequestContext {
  constructor(
    public req: Request,
    public res: Response,
    public next: INextFunction,
    public params: Record<string, string> = {},
    public query: Record<string, any> = {},
    public body: any = {},
    public user?: any,
    public pagination?: PaginationOptions,
    public request_id?: string
  ) {}
}
