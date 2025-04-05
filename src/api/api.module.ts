import { Singleton } from '@/core/di/container';
import { ControllerInfo } from '@/core/decorators/controller';
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { UsersControllerModule } from './users';
import { BaseControllerModule } from '@/core/decorators/controller-module';
import { ApiModule, API_MODULE_KEY } from '@/core/decorators/api-module';

@ApiModule({
  modules: [UsersControllerModule],
})
@Singleton()
export class ApiV1Module {
  private controllers: ControllerInfo[] = [];
  private logger: LoggerService;
  private controllerModules: BaseControllerModule[];

  constructor() {
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.debug('ApiV1Module', 'Initializing API v1 module');

    // Get modules from metadata
    const metadata = Reflect.getMetadata(API_MODULE_KEY, ApiV1Module);
    if (!metadata) {
      this.logger.error('ApiV1Module', 'No metadata found for API module');
      throw new Error('No metadata found for API module');
    }

    // Initialize controller modules
    this.controllerModules = metadata.modules.map((Module: new () => BaseControllerModule) => {
      this.logger.debug('ApiV1Module', `Resolving module ${Module.name}`);
      return di.get<BaseControllerModule>(Symbol.for(Module.name));
    });

    // Collect controllers from all modules
    this.controllerModules.forEach(module => {
      this.logger.debug('ApiV1Module', `Loading controllers from ${module.constructor.name}`);
      this.controllers.push(...module.getControllers());
    });

    this.logger.debug('ApiV1Module', `Loaded ${this.controllers.length} controllers`);
  }

  getControllers(): ControllerInfo[] {
    return this.controllers;
  }
}
