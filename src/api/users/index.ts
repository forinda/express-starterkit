import { ControllerModule } from '@/core/decorators/controller-module';
import { Singleton } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { di } from '@/core/di/container';
import { CreateUserController } from './controllers/create-user.controller';
import { GetUsersController } from './controllers/get-users.controller';
import { CreateUserRepositoryImpl } from './repositories/create-user.repository.impl';
import { GetUsersRepositoryImpl } from './repositories/get-users.repository.impl';
import { CreateUserService } from './services/create-user.service';
import { CreateUserRepositoryToken } from './services/create-user.service';
import { GetUsersRepositoryToken, GetUsersService } from './services/get-users.service';

@Singleton()
export class UsersControllerModule extends ControllerModule {
  private logger: LoggerService;

  constructor() {
    super();
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('UsersControllerModule', 'Initializing users controller module');

    // Register controllers
    this.registerController(CreateUserController);
    this.registerController(GetUsersController);

    // Bind repositories
    di.bind<CreateUserRepositoryImpl>(CreateUserRepositoryToken).to(CreateUserRepositoryImpl);
    di.bind<GetUsersRepositoryImpl>(GetUsersRepositoryToken).to(GetUsersRepositoryImpl);

    // Bind services
    di.bind<CreateUserService>(Symbol.for('CreateUserService')).to(CreateUserService);
    di.bind<GetUsersService>(Symbol.for('GetUsersService')).to(GetUsersService);
  }
}

export function initializeUsersModule() {
  // Register controllers
  di.get<CreateUserController>(Symbol.for('CreateUserController'));
}
