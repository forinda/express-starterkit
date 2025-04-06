import { ControllerModule } from '@/core/decorators/controller-module';
import { Singleton } from '@/core/di/container';
import { CreateUserController } from './controllers/create-user.controller';
import { GetUsersController } from './controllers/get-users.controller';

@Singleton()
export class UsersControllerModule extends ControllerModule {
  constructor() {
    super();
    this.registerController(CreateUserController).registerController(GetUsersController);
  }
}
