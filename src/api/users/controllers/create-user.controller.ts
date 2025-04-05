import { formatResponse } from '@/common/formatter/response';
import { ApiRequestContext } from '@/core/context/request';
import { Controller, Post } from '@/core/decorators/controller';
import { CreateUserService } from '../services/create-user.service';
import { di } from '@/core/di/container';
import { z } from 'zod';
import { CreateUserEntity } from '../entities/create-user-entity';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

@Controller('/users')
export class CreateUserController {
  private createUserService!: CreateUserService;

  @Post('/', {
    bodySchema: createUserSchema,
    auth: true,
  })
  async createUser({ body, res }: ApiRequestContext<CreateUserEntity>) {
    const user = await this.createUserService.execute(body);
    return formatResponse(res, {
      message: 'User created successfully',
      data: user,
    });
  }
}
