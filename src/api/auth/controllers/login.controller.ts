import { inject } from 'inversify';
import { Controller, Post } from '@/core/decorators/controller';
import { LoginDto } from '../services/login.service';
import { z } from 'zod';
import { ApiRequestContext } from '@/core/context/request';
import { formatResponse } from '@/core/utils/response';
import { LoginService } from '../services/login.service';
import { ConfigService } from '@/common/config';
import { SwaggerTag, SwaggerPath } from '@/core/decorators/swagger.decorator';
import { zodSchemaToRequestBody } from '@/core/utils/zod-to-swagger';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

@SwaggerTag('Authentication', 'Authentication related operations')
@Controller('/auth', { middlewares: [] })
export class LoginController {
  constructor(
    @inject(LoginService) private loginService: LoginService,
    @inject(ConfigService) private config: ConfigService
  ) {}

  @SwaggerPath('/auth/login', 'post', {
    summary: 'Login user',
    description: 'Authenticate user and return JWT token',
    tags: ['Authentication'],
    requestBody: zodSchemaToRequestBody(loginSchema),
    responses: {
      '200': {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                data: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/users' },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                error: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
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
