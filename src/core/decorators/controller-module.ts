import { ControllerInfo } from './controller';
import { LoggerService } from '@/common/logger';
import { di } from '../di/container';
import { Router } from 'express';

export const CONTROLLER_MODULE_KEY = Symbol('controller-module');

export interface ControllerModuleMetadata {
  controllers: any[];
}

export function ControllerModule(metadata: ControllerModuleMetadata) {
  return function (target: any) {
    const logger = new LoggerService();
    logger.debug('ControllerModule', `Registering module ${target.name}`);

    // Store module metadata
    Reflect.defineMetadata(CONTROLLER_MODULE_KEY, metadata, target);

    return target;
  };
}

export abstract class BaseControllerModule {
  protected logger: LoggerService;
  protected controllers: ControllerInfo[] = [];

  constructor() {
    this.logger = di.get<LoggerService>(Symbol.for('LoggerService'));
  }

  protected initializeController(controller: any, metadata: any): ControllerInfo {
    const router = Router({ mergeParams: true });

    // Set up routes
    metadata.routes.forEach((route: any) => {
      const handler = async (req: any, res: any, next: any) => {
        try {
          const controllerInstance = di.get<typeof controller>(Symbol.for(controller.name));
          const result = await controllerInstance[route.handlerName](req, res, next);
          if (result !== undefined && !res.headersSent) {
            return res.json(result);
          }
        } catch (error: any) {
          this.logger.error(
            this.constructor.name,
            `Error in ${controller.name}.${route.handlerName}: ${error.message}`
          );
          return next(error);
        }
      };

      const middleware = [...(metadata.middlewares || []), ...(route.middleware || [])];
      (router[route.method as keyof Router] as Function)(route.path, ...middleware, handler);
      this.logger.debug(
        this.constructor.name,
        `Registered route ${route.method.toUpperCase()} ${route.path} for ${controller.name}`
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
  }

  abstract getControllers(): ControllerInfo[];
}
