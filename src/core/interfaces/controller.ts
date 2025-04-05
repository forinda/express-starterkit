/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface Request extends ExpressRequest {
  user?: {
    id: number;
    name: string;
    roles?: string[];
    organizationId?: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiRequestContext<
  B = Record<string, any>,
  Q = Record<string, any>,
  P = Record<string, any>
> {
  req: Request;
  res: Response;
  next: NextFunction;
  params: P;
  query: Q;
  body: B;
  pagination?: PaginationParams;
  user?: any;
  request_id?: string;
}

export interface MethodProps {
  paramSchema?: z.Schema;
  querySchema?: z.Schema;
  bodySchema?: z.Schema;
  paginate?: boolean;
  injectIpInBody?: boolean;
  pathParamTransform?: {
    [key: string]: string;
  };
  audit?: (context: ApiRequestContext) => ApiRequestContext;
  auth?: boolean | string | string[];
  bodyBindOrgId?: boolean;
}

export interface LoginAuthorityOption {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
}
