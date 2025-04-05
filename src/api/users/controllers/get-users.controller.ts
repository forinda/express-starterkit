import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Get } from '@/core/decorators/controller';
import { GetUsersService } from '../services/get-users.service';
import { getUsersQuerySchema } from '../schemas/get-users.schema';
import { inject } from 'inversify';
import { generateMiddleware } from '@/common/utils/mock-md';

@Controller('/users', {
  middlewares: generateMiddleware('@Controller:User', 1),
})
export class GetUsersController {
  @inject(GetUsersService)
  private getUsersService!: GetUsersService;

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
