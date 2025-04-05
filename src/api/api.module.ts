import { DomainModule } from '@/core/decorators/domain-decorator';
import { userControllers } from './users/routes';
import { Singleton } from '@/core/di/container';
import { ControllerInfo, CONTROLLER_METADATA_KEY } from '@/core/decorators/controller';
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { di } from '@/core/di/container';
import { LoggerService } from '@/common/logger';

type RouteMetadata = {
  path: string;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  handlerName: string;
  middleware?: RequestHandler[];
};

type ControllerMetadata = {
  basePath: string;
  routes: RouteMetadata[];
  middlewares?: RequestHandler[];
};

@Singleton()
export class ApiV1Module {
  private controllers: ControllerInfo[];
  private logger: LoggerService;

  constructor() {
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
    this.logger.info('[ApiV1Module] Initializing API v1 module');

    // Extract controller info from metadata and set up routes
    this.controllers = userControllers.map(controller => {
      const metadata = Reflect.getMetadata(
        CONTROLLER_METADATA_KEY,
        controller
      ) as ControllerMetadata;
      if (!metadata) {
        this.logger.error(`[ApiV1Module] No metadata found for controller ${controller.name}`);
        throw new Error(`No metadata found for controller ${controller.name}`);
      }

      this.logger.debug(
        `[ApiV1Module] Setting up routes for controller ${controller.name} at path ${metadata.basePath}`
      );

      const router = Router({ mergeParams: true });

      // Set up routes from metadata
      metadata.routes.forEach((route: RouteMetadata) => {
        const handler = async (req: Request, res: Response, next: NextFunction) => {
          try {
            // Get controller instance from DI container
            const controllerInstance = di.get(Symbol.for(controller.name)) as any;
            const result = await controllerInstance[route.handlerName](req, res, next);

            // If result is not undefined and response hasn't been sent, send it
            if (result !== undefined && !res.headersSent) {
              res.json(result);
            }
          } catch (error: any) {
            this.logger.error(
              `[ApiV1Module] Error in ${controller.name}.${route.handlerName}: ${error.message}`
            );
            next(error);
          }
        };

        // Apply route middleware if any
        const middleware = [...(metadata.middlewares || []), ...(route.middleware || [])];

        // Register the route with its middleware
        router[route.method](route.path, ...middleware, handler);
        this.logger.debug(
          `[ApiV1Module] Registered route ${route.method.toUpperCase()} ${route.path} for ${
            controller.name
          }`
        );
      });

      return {
        target: controller,
        router,
        path: metadata.basePath,
        basePath: metadata.basePath,
        routes: metadata.routes,
        middlewares: metadata.middlewares,
        version: 'v1',
      };
    });
  }

  getControllers(): ControllerInfo[] {
    return this.controllers;
  }
}
