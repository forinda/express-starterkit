/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Singleton } from '@/core/di/container';
import { ControllerInfo } from '@/core/decorators/controller';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';
import { UsersControllerModule } from './users';
import { AuthControllerModule } from './auth';
import { HealthControllerModule } from './health';
import { ControllerModule } from '@/core/decorators/controller-module';
import { ApiModule, API_MODULE_KEY } from '@/core/decorators/api-module';

@ApiModule({
  modules: [UsersControllerModule, AuthControllerModule, HealthControllerModule],
})
@Singleton()
export class ApiV1Module {
  private _controllers: ControllerInfo[] = [];
  private logger: LoggerService;
  private _controller_modules: ControllerModule[];

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
    this._controller_modules = metadata.modules.map((Module: new () => ControllerModule) => {
      this.logger.debug('ApiV1Module', `Resolving module ${Module.name}`);
      return di.get<ControllerModule>(Symbol.for(Module.name));
    });

    // Collect controllers from all modules
    this._controller_modules.forEach(module => {
      // this.logger.debug('ApiV1Module', `Loading controllers from ${module.constructor.name}`);
      this._controllers.push(...module.getAllControllers());
    });

    // this.logger.debug('ApiV1Module', `Loaded ${this.controllers.length} controllers`);
  }

  get controllers(): ControllerInfo[] {
    return this._controllers;
  }

  get controller_modules(): ControllerModule[] {
    return this._controller_modules;
  }
}
