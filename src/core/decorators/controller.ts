import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { di } from '../di/container';
import { LoggerService } from '@/common/logger';

export const CONTROLLER_METADATA_KEY = Symbol('controller');

// Initialize logger
const logger = new LoggerService();

export interface RouteMetadata {
  path: string;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  handlerName: string;
  middleware?: RequestHandler[];
}

export interface ControllerMetadata {
  basePath: string;
  routes: RouteMetadata[];
  middlewares?: RequestHandler[];
}

export interface ControllerInfo extends ControllerMetadata {
  target: any;
  router: Router;
  version?: string;
  path?: string;
}

type ControllerOptions = {
  middleware?: RequestHandler[];
};

export function Controller(basePath: string, options?: ControllerOptions) {
  return function (target: any) {
    logger.debug(`[Controller] Registering ${target.name} at path ${basePath}`);

    // Normalize base path
    const normalizedBasePath =
      basePath.endsWith('/') && basePath !== '/' ? basePath.slice(0, -1) : basePath;

    // Initialize controller metadata
    const controllerMetadata: ControllerMetadata = {
      basePath: normalizedBasePath,
      routes: [],
      middlewares: options?.middleware || [],
    };

    // Collect all route metadata from the controller's methods
    const propertyKeys = Object.getOwnPropertyNames(target.prototype).filter(
      k =>
        k !== 'constructor' &&
        typeof target.prototype[k] === 'function' &&
        Reflect.hasMetadata(CONTROLLER_METADATA_KEY, target.prototype, k)
    );

    propertyKeys.forEach(key => {
      const routeMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target.prototype, key);
      if (routeMetadata) {
        controllerMetadata.routes.push(routeMetadata);
        logger.debug(
          `[Controller] Registered route ${routeMetadata.method.toUpperCase()} ${
            routeMetadata.path
          } for ${target.name}.${key}`
        );
      }
    });

    // Store controller metadata
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, controllerMetadata, target);

    // Bind controller to DI container
    const token = Symbol.for(target.name);
    di.bind(token).to(target).inSingletonScope();

    return target;
  };
}

// Method Decorator Factory
function createMethodDecorator(
  method: keyof Pick<Router, 'all' | 'get' | 'head' | 'delete' | 'patch' | 'post' | 'put'>
) {
  return (path: string, options?: { middleware?: RequestHandler[] }) => {
    return (target: any, propertyKey: string) => {
      const routeMetadata: RouteMetadata = {
        path,
        method: method.toLowerCase() as any,
        handlerName: propertyKey,
        middleware: options?.middleware || [],
      };

      Reflect.defineMetadata(CONTROLLER_METADATA_KEY, routeMetadata, target, propertyKey);
    };
  };
}

// HTTP Method Decorators
export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');
export const Put = createMethodDecorator('put');
export const Delete = createMethodDecorator('delete');
export const Patch = createMethodDecorator('patch');
export const All = createMethodDecorator('all');
