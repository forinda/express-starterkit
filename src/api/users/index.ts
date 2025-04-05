import { ControllerModule } from '@/core/decorators/controller-module';
import { ControllerInfo } from '@/core/decorators/controller';
import { CreateUserController } from './controllers/create-user.controller';
import { GetUsersController } from './controllers/get-users.controller';
import { Singleton } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { di } from '@/core/di/container';

@Singleton()
export class UsersControllerModule extends ControllerModule {
  private logger: LoggerService;

  constructor() {
    super();
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('UsersControllerModule', 'Initializing users controller module');
    this.registerController(CreateUserController);
    this.registerController(GetUsersController);
  }
}
