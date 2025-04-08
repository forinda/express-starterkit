import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Post } from '@/core/decorators/controller';
import { CreateUserService } from '../services/create-user.service';
import { z } from 'zod';
import { CreateUserEntity } from '../entities/create-user-entity';
import { SwaggerTag, SwaggerPath } from '@/core/decorators/swagger.decorator';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

@SwaggerTag('Users', 'User management operations')
@Controller('/users')
export class CreateUserController {
  private createUserService!: CreateUserService;

  @SwaggerPath('/users', 'post', {
    summary: 'Create user',
    description: 'Create a new user',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'email'],
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                description: 'User full name',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
              },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                data: { $ref: '#/components/schemas/users' },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid input',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                error: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @Post('/', {
    bodySchema: createUserSchema,
    auth: true,
  })
  async createUser({ body, res }: ApiRequestContext<CreateUserEntity>) {
    const user = await this.createUserService.execute(body);
    return formatResponse(res, {
      message: 'User created successfully',
      data: user,
    });
  }
}
