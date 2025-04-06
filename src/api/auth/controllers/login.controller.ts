import { injectable, inject } from 'inversify';
import { Controller, Post } from '@/core/decorators/controller';
import { LoginDto } from '../services/login.service';
import { z } from 'zod';
import { ApiRequestContext } from '@/core/context/request';
import { formatResponse } from '@/core/utils/response';
import { LoginService } from '../services/login.service';
import { ConfigService } from '@/common/config';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

@Controller('/auth', { middlewares: [] })
export class LoginController {
  constructor(
    @inject(LoginService) private loginService: LoginService,
    @inject(ConfigService) private config: ConfigService
  ) {}

  @Post('/login', { bodySchema: loginSchema })
  async login(context: ApiRequestContext<LoginDto>) {
    const result = await this.loginService.execute(context.body);
    const cookieOpts = this.config.getCookieConfig();
    // Set cookie
    context.res.cookie(cookieOpts.name, result.token, {
      httpOnly: true,
      secure: cookieOpts.options.secure,
      sameSite: cookieOpts.options.sameSite,
      maxAge: cookieOpts.options.maxAge,
    });

    return formatResponse('Login successful', { user: result.user });
  }
}
