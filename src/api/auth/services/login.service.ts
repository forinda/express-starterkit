import { injectable, inject } from 'inversify';
import { FindByEmailRepository } from '../repositories/find-by-email.repository';
import { AuthUtils } from '@/core/utils/auth.utils';

export interface LoginDto {
  email: string;
  password: string;
}

@injectable()
export class LoginService {
  constructor(
    @inject(Symbol.for('FindByEmailRepository'))
    private findByEmailRepository: FindByEmailRepository,
    @inject(Symbol.for('AuthUtils')) private authUtils: AuthUtils
  ) {}

  async execute(loginData: LoginDto) {
    const user = await this.findByEmailRepository.execute(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.authUtils.comparePasswords(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.authUtils.generateToken({ userId: user.id });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
