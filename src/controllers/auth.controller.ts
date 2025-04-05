import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../config/types';
import { UserService, CreateUserDto, LoginDto } from '../services/user.service';
import { validateRequest } from '../middleware/validation.middleware';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

@controller('/auth')
export class AuthController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpPost('/register', validateRequest(createUserSchema))
  async register(@requestBody() userData: CreateUserDto) {
    try {
      const user = await this.userService.create(userData);
      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof Error && error.message.includes('unique')) {
        return { message: 'Email already exists' };
      }
      throw error;
    }
  }

  @httpPost('/login', validateRequest(loginSchema))
  async login(@requestBody() loginData: LoginDto) {
    try {
      const result = await this.userService.login(loginData);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message };
      }
      throw error;
    }
  }
}
