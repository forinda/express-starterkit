import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Get } from '@/core/decorators/controller';
import { GetUsersService } from '../services/get-users.service';
import { getUsersQuerySchema } from '../schemas/get-users.schema';
import { inject } from 'inversify';

@Controller('/users')
export class GetUsersController {
  @inject(GetUsersService)
  private getUsersService!: GetUsersService;

  @Get('/', {
    querySchema: getUsersQuerySchema,
  })
  async getUsers(context: ApiRequestContext) {
    const { query, pagination = { page: 1, limit: 10 } } = context;
    const result = await this.getUsersService.execute(query, pagination);
    return formatResponse(context.res, {
      message: 'Users fetched successfully',
      data: result,
    });
  }
}
