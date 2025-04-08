import { SwaggerSchema } from '@/core/decorators/swagger.decorator';
import { users } from '@/db/schema';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

@SwaggerSchema(users)
export class AuthSchemas {
  static login = loginSchema;
  static register = registerSchema;
}
