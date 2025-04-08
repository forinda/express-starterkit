import { SwaggerSchema } from '@/core/decorators/swagger.decorator';
import { users } from '@/db/schema';
import { loginSchema } from './login.schema';
import { registerSchema } from './register.schema';

@SwaggerSchema(users)
export class AuthSchemas {
  static login = loginSchema;
  static register = registerSchema;
}
