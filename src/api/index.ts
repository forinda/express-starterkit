import { AppModule } from '@/app/module';
import { ApiVersion } from '@/core/decorators/api';
import { Application, Router } from 'express';
import { inject, injectable } from 'inversify';

@ApiVersion('v1')
export class Api {
  private version: string = 'v1';
  private basePath: string = '/api/v1';
  private router: Router = Router({ caseSensitive: true });
  @inject(AppModule) private module: AppModule = {} as AppModule;
  // This is the main module for API version 1
  // It can be used to define routes, controllers, and other configurations specific to this version
  // For example, you can define a controller for handling user-related requests
  // and register it here to be part of the API version 1
  // You can also define middleware, error handling, and other configurations
  // that are specific to this version of the API
  mountRouter(router: Router) {
    // This method is called to mount the router for this module
    // You can use this method to define the routes for this module
    // and register them with the router
    // For example, you can define a route for handling user-related requests
    // and register it here to be part of the API version 1
    this.router = router;
  }

  setup(application: Application) {
    application.use(this.basePath, this.router);
  }
}
