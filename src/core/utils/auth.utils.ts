import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

export class AuthUtils {
  constructor(private config: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  generateToken(payload: Record<string, any>): string {
    return sign(payload, this.config.jwtSecret, { expiresIn: '1h' });
  }

  verifyToken(token: string): Record<string, any> {
    return verify(token, this.config.jwtSecret) as Record<string, any>;
  }
}
