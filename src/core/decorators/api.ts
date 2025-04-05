import { Router } from 'express';
import { DOMAIN_INJECTOR_KEYS } from './domain-decorator';
import { CONTROLLER_KEYS } from '../config/controller-keys';
import { di } from '../di/container';
import { INextFunction, IRequest, IResponse } from '../interfaces/http';
import { ControllerMetadata } from './controller';
import { injectable } from 'inversify';

export const API_META_KEYS = {
  apiVersion: Symbol.for('apiVersion'),
  apiPath: Symbol.for('apiPath'),
  router: Symbol.for('router'),
};
export function ApiVersion(version: string, options: { path?: string } = { path: '/' }) {
  const wrapHandler = (
    fn: (req: IRequest, res: IResponse, next: INextFunction) => Promise<any> | any
  ) => {
    return async (req: IRequest, res: IResponse, next: INextFunction) => {
      try {
        return await fn(req, res, next);
      } catch (error) {
        return next(error);
      }
    };
  };
  return function (target: any) {
    injectable()(target);
    const router = Reflect.getMetadata(API_META_KEYS.router, target) || Router();
    Reflect.defineMetadata(API_META_KEYS.apiVersion, version, target);
    Reflect.defineMetadata(API_META_KEYS.apiPath, options.path, target);
    if (target.protype.module) {
      console.log('Injecting controllers');

      (Reflect.getMetadata(DOMAIN_INJECTOR_KEYS.controllers, target.protype.module) || []).forEach(
        (controller: any) => {
          const metadata = Reflect.getMetadata(
            CONTROLLER_KEYS.INJECTED_CONTROLLER,
            controller
          ) as ControllerMetadata;
          if (!metadata) {
            return;
          }
          const instance = di.resolve(controller) as any;
          metadata.routes.forEach(route => {
            const handler = instance[route.handlerName].bind(instance);
            // Collect all middleware
            const middlewares = [
              ...(metadata.middlewares ?? []),
              ...(route.middleware || []),
              wrapHandler(handler),
            ];
            const fullPath = `${options.path}${metadata.basePath}${route.path}`;
            router[route.method](fullPath, ...middlewares);
          });
        }
      );
    }
    if (!Reflect.hasMetadata(API_META_KEYS.router, target)) {
      Reflect.defineMetadata(API_META_KEYS.router, router, target);
    }
    // Check if target has method known as mount. If it's there, call it with the router
    if (typeof target.mount === 'function') {
      // Check if the mount method is a function
      target.mount(router);
    }
  };
}
