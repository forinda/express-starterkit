import express, { Router } from 'express';
import { injectable } from 'inversify';
type MiddlewareType = express.RequestHandler;

type RouteMetadata = {
  path: string;
  method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
  handlerName: string;
  middleware?: MiddlewareType[];
};

export type ControllerMetadata = {
  basePath: string;
  routes: RouteMetadata[];
  middlewares?: MiddlewareType[];
};

type RouteOptions = {
  middleware?: MiddlewareType[];
};
type ControllerOptions = {
  middleware?: MiddlewareType[];
};

// Metadata Keys
const MetaDataKeys = {
  controller: Symbol.for('ApiController:metadata'),
  route: Symbol.for('ApiController:route'),
};

export function Controller(basePath: string, options?: ControllerOptions) {
  return function (target: any) {
    injectable()(target);
    const normalizedBasePath =
      basePath.endsWith('/') && basePath !== '/' ? basePath.slice(0, -1) : basePath;

    const controllerMetadata: ControllerMetadata = {
      basePath: normalizedBasePath,
      routes: [],
      middlewares: options?.middleware || [],
    };

    const propertyKeys = Object.getOwnPropertyNames(target.prototype).filter(
      k =>
        k !== 'constructor' &&
        typeof target.prototype[k] === 'function' &&
        Reflect.hasMetadata(MetaDataKeys.route, target.prototype, k)
    );

    propertyKeys.forEach(key => {
      const routeMetadata = Reflect.getMetadata(MetaDataKeys.route, target.prototype, key);
      if (routeMetadata) {
        controllerMetadata.routes.push(routeMetadata);
      }
    });

    Reflect.defineMetadata(MetaDataKeys.controller, controllerMetadata, target);
  };
}

// Method Decorator Factory
function createMethodDecorator(
  method: keyof Pick<Router, 'all' | 'get' | 'head' | 'delete' | 'patch' | 'post' | 'put'>
) {
  return (path: string, options?: RouteOptions) => {
    return (target: any, propertyKey: string) => {
      const routeMetadata: RouteMetadata = {
        path,
        method: method.toLowerCase() as any,
        handlerName: propertyKey,
        middleware: options?.middleware || [],
      };

      Reflect.defineMetadata(MetaDataKeys.route, routeMetadata, target, propertyKey);
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
