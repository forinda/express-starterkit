import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Post } from '@/core/decorators/controller';

@Controller('/users')
export class CreateUserController {
  @Post('/')
  async createUser({ body, res }: ApiRequestContext<{ name: string; email: string }>) {
    // Logic to create a user
    const { name, email } = body;

    // Simulate user creation
    const newUser = {
      id: Date.now(),
      name,
      email,
    };

    // Send response
    // return res.status(201).json({
    //   message: 'User created successfully',
    //   user: newUser,
    // });
    return formatResponse(res, {
      message: 'User created successfully',
      user: newUser,
    });
  }
}
