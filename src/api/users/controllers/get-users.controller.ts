import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Get } from '@/core/decorators/controller';
import { GetUsersService } from '../services/get-users.service';
import { getUsersQuerySchema } from '../schemas/get-users.schema';
import { inject } from 'inversify';
import { generateMiddleware } from '@/common/utils/mock-md';
import { SwaggerTag, SwaggerPath } from '@/core/decorators/swagger.decorator';

@SwaggerTag('Users', 'User management operations')
@Controller('/users', {
  middlewares: generateMiddleware('@Controller:User', 1),
})
export class GetUsersController {
  @inject(GetUsersService)
  private getUsersService!: GetUsersService;

  @SwaggerPath('/users', 'get', {
    summary: 'Get users',
    description: 'Get a list of users with pagination and sorting',
    tags: ['Users'],
    parameters: [
      {
        name: 'page',
        in: 'query',
        description: 'Page number',
        schema: { type: 'integer', minimum: 1, default: 1 },
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Number of items per page',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      },
      {
        name: 'sort',
        in: 'query',
        description: 'Sort field and direction (e.g., "name:asc")',
        schema: { type: 'string' },
      },
    ],
    responses: {
      '200': {
        description: 'Users fetched successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                data: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/users' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get('/', {
    querySchema: getUsersQuerySchema,
    paginate: true,
    middlewares: generateMiddleware('@Controller:@Get:User', 2),
  })
  async getUsers(context: ApiRequestContext) {
    const { query } = context;
    const { sort } = query;

    const result = await this.getUsersService.execute(query, context.pagination, sort);

    return formatResponse(context.res, {
      message: 'Users fetched successfully',
      data: result,
    });
  }
}
