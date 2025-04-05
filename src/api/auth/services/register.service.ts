import { injectable, inject } from 'inversify';
import { FindByEmailRepository } from '../repositories/find-by-email.repository';
import { RegisterUserRepository } from '../repositories/register-user.repository';
import { AuthUtils } from '@/core/utils/auth.utils';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  gender?: 'Male' | 'Female' | 'Other';
}

@injectable()
export class RegisterService {
  constructor(
    @inject(Symbol.for('FindByEmailRepository'))
    private findByEmailRepository: FindByEmailRepository,
    @inject(Symbol.for('RegisterUserRepository'))
    private registerUserRepository: RegisterUserRepository,
    @inject(Symbol.for('AuthUtils')) private authUtils: AuthUtils
  ) {}

  async execute(userData: RegisterDto) {
    const existingUser = await this.findByEmailRepository.execute(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await this.authUtils.hashPassword(userData.password);
    const user = await this.registerUserRepository.execute({
      ...userData,
      password: hashedPassword,
    });

    return { id: user.id, name: user.name, email: user.email };
  }
}
