import { ApiVersion } from '@/core/decorators/api';
import { Application, Router } from 'express';
import { Singleton } from '@/core/di/container';
import { ApiV1Module } from './api.module';
import { LoggerService } from '@/common/logger';
import { resolve } from '@/core/di/container';

@ApiVersion('v1')
@Singleton()
export class Api {
  private version: string = 'v1';
  private basePath: string = '/api/v1';
  private router: Router = Router({ caseSensitive: true });
  // This is the main module for API version 1
  // It can be used to define routes, controllers, and other configurations specific to this version
  // For example, you can define a controller for handling user-related requests
  // and register it here to be part of the API version 1
  // You can also define middleware, error handling, and other configurations
  // that are specific to this version of the API

  private logger: LoggerService;
  private apiModule: ApiV1Module;

  constructor() {
    this.logger = resolve(LoggerService);
    this.apiModule = resolve(ApiV1Module);
    this.logger.info('Api', `Initializing API ${this.version}`);
  }

  private mountControllers() {
    // Get controllers from the module
    const controllers = this.apiModule.getControllers();

    // Mount each controller
    for (const controller of controllers) {
      const fullPath = `${this.basePath}${controller.path}`;
      this.router.use(controller.path!, controller.router);
      this.logger.info('Api', `Mounted controller at ${fullPath}`);
    }
  }

  setup(application: Application) {
    // Mount controllers
    this.mountControllers();

    // Mount API router
    application.use(this.basePath, this.router);
    this.logger.info('Api', `Mounted API ${this.version} at ${this.basePath}`);
  }
}
