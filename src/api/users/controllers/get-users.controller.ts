import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Get } from '@/core/decorators/controller';
import { GetUsersService } from '../services/get-users.service';
import { getUsersQuerySchema } from '../schemas/get-users.schema';
import { inject } from 'inversify';

@Controller('/users', {
  middlewares: [
    (request, response, nextF) => {
      console.log('Middleware executed for GetUsersController');
      nextF();
    },
  ],
})
export class GetUsersController {
  @inject(GetUsersService)
  private getUsersService!: GetUsersService;

  @Get('/', {
    querySchema: getUsersQuerySchema,
    paginate: true,
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
