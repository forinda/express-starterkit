import { ControllerModule } from '@/core/decorators/controller-module';
import { Singleton } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { di } from '@/core/di/container';
import { LoginController } from './controllers/login.controller';
import { RegisterController } from './controllers/register.controller';

@Singleton()
export class AuthControllerModule extends ControllerModule {
  private logger: LoggerService;

  constructor() {
    super();
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('[AuthControllerModule]', 'Initializing auth controller module');

    // Register controllers
    this.registerController(LoginController).registerController(RegisterController);
  }
}
