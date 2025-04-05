import { ControllerModule } from '@/core/decorators/controller-module';
import { Singleton } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { di } from '@/core/di/container';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';
import { FindByEmailRepository } from './repositories/find-by-email.repository';
import { RegisterUserRepository } from './repositories/register-user.repository';
import { AuthUtils } from '@/core/utils/auth.utils';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Singleton()
export class AuthControllerModule extends ControllerModule {
  private logger: LoggerService;

  constructor() {
    super();
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('AuthControllerModule', 'Initializing auth controller module');

    // Register controllers
    this.registerController(LoginController);
    this.registerController(RegisterController);

    // Register repositories
    di.bind<FindByEmailRepository>(Symbol.for('FindByEmailRepository')).to(FindByEmailRepository);
    di.bind<RegisterUserRepository>(Symbol.for('RegisterUserRepository')).to(
      RegisterUserRepository
    );

    // Register utils
    di.bind<AuthUtils>(Symbol.for('AuthUtils')).to(AuthUtils);

    // Register services
    di.bind<LoginService>(Symbol.for('LoginService')).to(LoginService);
    di.bind<RegisterService>(Symbol.for('RegisterService')).to(RegisterService);
  }
}

export function initializeAuthModule() {
  // Register controllers
  di.get<LoginController>(Symbol.for('LoginController'));
  di.get<RegisterController>(Symbol.for('RegisterController'));
}
