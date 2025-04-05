/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Controller, Get, Post, Put, Delete } from '@/core/decorators/controller';
import { ApiRequestContext } from '@/core/interfaces/controller';
import { z } from 'zod';
import { userAudit } from '@/core/utils/audit';
import { createHttpResponse } from '@/core/utils/responder';
import { HttpStatus } from '@/core/http';

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

@Controller('/users')
export class UserController {
  @Get('/', {
    paginate: true,
    auth: ['admin'],
  })
  async getUsers(context: ApiRequestContext) {
    const { pagination } = context;
    // Implementation would go here
    return createHttpResponse(context.res, {
      data: [],
      statusCode: HttpStatus.OK,
    });
  }

  @Get('/:id', {
    paramSchema: z.object({
      id: z.string().uuid(),
    }),
    auth: true,
  })
  async getUser(context: ApiRequestContext) {
    const { params } = context;
    // Implementation would go here
    return createHttpResponse(context.res, {
      data: { id: params.id },
      statusCode: HttpStatus.OK,
    });
  }

  @Post('/', {
    bodySchema: createUserSchema,
    auth: ['admin'],
    audit: userAudit('create'),
    bodyBindOrgId: true,
  })
  async createUser(context: ApiRequestContext) {
    const { body } = context;
    // Implementation would go here
    return createHttpResponse(context.res, {
      data: body,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Put('/:id', {
    paramSchema: z.object({
      id: z.string().uuid(),
    }),
    bodySchema: updateUserSchema,
    auth: true,
    audit: userAudit('update'),
    pathParamTransform: {
      id: 'userId',
    },
  })
  async updateUser(context: ApiRequestContext) {
    const { body, params } = context;
    // Implementation would go here
    return createHttpResponse(context.res, {
      data: { ...body, id: params.userId },
      statusCode: HttpStatus.OK,
    });
  }

  @Delete('/:id', {
    paramSchema: z.object({
      id: z.string().uuid(),
    }),
    auth: true,
    audit: userAudit('delete'),
  })
  async deleteUser(context: ApiRequestContext) {
    const { params } = context;
    // Implementation would go here
    return createHttpResponse(context.res, {
      statusCode: HttpStatus.NO_CONTENT,
    });
  }
}
