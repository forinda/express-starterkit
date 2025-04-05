import { Controller, Get } from '@/core/decorators/controller';

@Controller('/users')
export class GetUsersController {
  @Get('/')
  async getUsers(req: any, res: any) {
    return res.status(200).json({
      message: 'Users fetched successfully',
      users: [
        {
          name: 'John Doe',
        },
        {
          name: 'Jane Doe',
        },
      ],
    });
  }
}
