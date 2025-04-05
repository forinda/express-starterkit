import { Controller, Post } from '@/core/decorators/controller';

@Controller('/users')
export class CreateUserController {
  @Post('/')
  async createUser(req: any, res: any) {
    // Logic to create a user
    const { name, email } = req.body;

    // Simulate user creation
    const newUser = {
      id: Date.now(),
      name,
      email,
    };

    // Send response
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  }
}
