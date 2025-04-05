/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { ApiRequestContext, LoginAuthorityOption, Request } from '../interfaces/controller';
import { HttpStatus } from '../http';
import { createHttpResponse } from './responder';
import { LoginAuthorityType } from '@/common/constants/permissions';

export function controllerAuth(context: ApiRequestContext, bodyBindOrgId?: boolean) {
  return async (auth?: LoginAuthorityType) => {
    if (!auth) return;

    const user = context.req.user;
    if (!user) {
      throw createHttpResponse(context.res, {
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (typeof auth === 'string') {
      if (!user.roles?.includes(auth)) {
        throw createHttpResponse(context.res, {
          message: 'Forbidden',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
    }

    if (Array.isArray(auth)) {
      const hasRole = auth.some(role => user.roles?.includes(role));
      if (!hasRole) {
        throw createHttpResponse(context.res, {
          message: 'Forbidden',
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
    }

    if (bodyBindOrgId && user.organizationId) {
      context.body.organizationId = user.organizationId;
    }

    context.user = user;
  };
}
