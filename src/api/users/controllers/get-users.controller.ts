import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Get } from '@/core/decorators/controller';

@Controller('/users')
export class GetUsersController {
  @Get('/')
  async getUsers({ res }: ApiRequestContext) {
    const data = {
      message: 'Users fetched successfully',
      users: [
        {
          name: 'John Doe',
        },
        {
          name: 'Jane Doe',
        },
      ],
    };
    return formatResponse(res, data);
  }
}
