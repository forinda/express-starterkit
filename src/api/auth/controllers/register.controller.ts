import { inject } from 'inversify';
import { Controller, Post } from '@/core/decorators/controller';
import { RegisterDto } from '../services/register.service';
import { z } from 'zod';
import { ApiRequestContext } from '@/core/context/request';
import { formatResponse } from '@/core/utils/response';
import { RegisterService } from '../services/register.service';
import { SwaggerTag, SwaggerPath } from '@/core/decorators/swagger.decorator';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

@SwaggerTag('Authentication', 'Authentication related operations')
@Controller('/auth')
export class RegisterController {
  constructor(@inject(RegisterService) private registerService: RegisterService) {}

  @SwaggerPath('/auth/register', 'post', {
    summary: 'Register new user',
    description: 'Create a new user account',
    tags: ['Authentication'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'email', 'password'],
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
              password: {
                type: 'string',
                format: 'password',
                minLength: 6,
                description: 'User password',
              },
              gender: {
                type: 'string',
                enum: ['Male', 'Female', 'Other'],
                description: 'User gender (optional)',
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
  @Post('/register', { bodySchema: registerSchema })
  async register(context: ApiRequestContext<RegisterDto>) {
    const user = await this.registerService.execute(context.body);
    return formatResponse('User created successfully', user);
  }
}
