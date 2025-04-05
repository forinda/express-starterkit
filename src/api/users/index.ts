import { CONTROLLER_MODULE_KEY, ControllerModule } from '@/core/decorators/controller-module';
import { BaseControllerModule } from '@/core/decorators/controller-module';
import { ControllerInfo, CONTROLLER_METADATA_KEY } from '@/core/decorators/controller';
import { CreateUserController } from './controllers/create-user.controller';
import { GetUsersController } from './controllers/get-users.controller';
import { Singleton } from '@/core/di/container';

@ControllerModule({
  controllers: [CreateUserController, GetUsersController],
})
@Singleton()
export class UsersControllerModule extends BaseControllerModule {
  constructor() {
    super();
    this.logger.debug('UsersControllerModule', 'Initializing users controller module');
    this.initializeControllers();
  }

  private initializeControllers() {
    const metadata = Reflect.getMetadata(CONTROLLER_MODULE_KEY, UsersControllerModule);
    if (!metadata) {
      this.logger.error('UsersControllerModule', 'No metadata found for users controller module');
      throw new Error('No metadata found for users controller module');
    }

    this.controllers = metadata.controllers.map((controller: new (...args: any[]) => any) => {
      const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, controller);
      if (!controllerMetadata) {
        this.logger.error(
          'UsersControllerModule',
          `No metadata found for controller ${controller.name}`
        );
        throw new Error(`No metadata found for controller ${controller.name}`);
      }

      return this.initializeController(controller, controllerMetadata);
    });

    this.logger.debug(
      'UsersControllerModule',
      `Initialized ${this.controllers.length} controllers`
    );
  }

  getControllers(): ControllerInfo[] {
    return this.controllers;
  }
}
