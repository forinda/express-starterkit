import { injectable, inject } from 'inversify';
import { Controller, Post } from '@/core/decorators/controller';
import { RegisterDto } from '../services/register.service';
import { z } from 'zod';
import { ApiRequestContext } from '@/core/context/request';
import { formatResponse } from '@/core/utils/response';
import { RegisterService } from '../services/register.service';
import { Singleton } from '@/core/di/container';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

@Controller('/auth')
export class RegisterController {
  constructor(@inject(RegisterService) private registerService: RegisterService) {}

  @Post('/register', { bodySchema: registerSchema })
  async register(context: ApiRequestContext<RegisterDto>) {
    const user = await this.registerService.execute(context.body);
    return formatResponse('User created successfully', user);
  }
}
