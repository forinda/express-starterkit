/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Router, RequestHandler } from 'express';
import { di } from '../di/container';
import { LoggerService } from '@/common/logger';
import { withContext, ContextTransformer, RouteHandlerContext, RouteOptions } from './context';
import { CONTROLLER_METADATA_KEY, ROUTES_METADATA_KEY } from './metadata';
import { LoginAuthorityType } from '@/common/constants/permissions';

// Initialize logger
const logger = new LoggerService();

export interface RouteMetadata<B = any, Q = any, P = any> {
  method: string;
  path: string;
  handlerName: string;
  transformer?: ContextTransformer<B, Q, P>;
  options?: RouteOptions;
}

export interface ControllerMetadata {
  basePath: string;
}

export interface ControllerInfo extends ControllerMetadata {
  target: any;
  router: Router;
  version?: string;
  path?: string;
  routes: RouteMetadata[];
}

type ControllerOptions = {
  middleware?: RequestHandler[];
};

export function Controller(basePath: string = '/', options?: ControllerOptions) {
  return function (target: any) {
    console.debug(`[Controller] Registering ${target.name} at path ${basePath}`);

    // Normalize base path
    const normalizedBasePath =
      basePath.endsWith('/') && basePath !== '/' ? basePath.slice(0, -1) : basePath;

    // Initialize controller metadata
    const controllerMetadata: ControllerMetadata = {
      basePath: normalizedBasePath,
    };

    // Collect all route metadata from the controller's methods
    const routes: RouteMetadata[] =
      Reflect.getMetadata(ROUTES_METADATA_KEY, target.prototype) || [];
    routes.forEach(route => {
      console.debug(
        `[Controller] Registered route ${route.method.toUpperCase()} ${route.path} for ${
          target.name
        }.${route.handlerName}`
      );
    });

    // Store controller metadata
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, controllerMetadata, target);

    // Bind controller to DI container
    const token = Symbol.for(target.name);
    di.bind(token).to(target).inSingletonScope();

    return target;
  };
}

function createRouteDecorator<B = any, Q = any, P = any>(method: string) {
  return (
    path: string = '/',
    options: {
      transformer?: ContextTransformer<B, Q, P>;
      paginate?: boolean;
      auth?: LoginAuthorityType;
    } = {}
  ): MethodDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      const routes: RouteMetadata[] = Reflect.getMetadata(ROUTES_METADATA_KEY, target) || [];
      routes.push({
        method,
        path,
        handlerName: propertyKey as string,
        transformer: options.transformer,
        options: {
          paginate: options.paginate,
          auth: options.auth,
        },
      });
      Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
    };
  };
}

// HTTP Method Decorators
export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');
export const Patch = createRouteDecorator('patch');
