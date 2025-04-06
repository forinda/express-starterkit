import { ConfigService } from '@/common/config';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export class AuthUtils {
  constructor(private config: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  generateToken(payload: Record<string, any>): string {
    return sign(payload, this.config.getJWTConfig().secret, { expiresIn: '1h' });
  }

  verifyToken(token: string): Record<string, any> {
    return verify(token, this.config.getJWTConfig().secret) as Record<string, any>;
  }
}
