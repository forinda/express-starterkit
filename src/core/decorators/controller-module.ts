/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { di } from '../di/container';
import { LoggerService } from '@/common/logger';
import { ControllerInfo } from './controller';
import { transformToContext } from './context';
import { CONTROLLER_METADATA_KEY, ROUTES_METADATA_KEY } from './metadata';

const logger = new LoggerService();

export class ControllerModule {
  private controllers: Map<string, ControllerInfo> = new Map();

  public registerController(target: any): void {
    const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
    const routes = Reflect.getMetadata(ROUTES_METADATA_KEY, target.prototype) || [];

    if (!controllerMetadata) {
      throw new Error(`Controller ${target.name} is not decorated with @Controller`);
    }

    const router = Router();
    const controllerInfo: ControllerInfo = {
      ...controllerMetadata,
      target,
      router,
      routes,
    };

    this.controllers.set(target.name, controllerInfo);
    logger.debug('[ControllerModule]', `Registered controller ${target.name}`);
  }

  public initializeController(controllerInfo: ControllerInfo): void {
    const { target, router, routes } = controllerInfo;
    const instance = di.resolve(target) as any;

    routes.forEach(route => {
      const { method, path, handlerName, transformer, options } = route;
      const handler = instance[handlerName].bind(instance);

      (router as any)[method](path, (req: Request, res: Response, next: NextFunction) => {
        return transformToContext(req, res, next, handler, { ...(options ?? {}), transformer });
      });

      logger.debug(
        '[ControllerModule]',
        `Initialized route ${method.toUpperCase()} ${path} for ${target.name}.${handlerName}`
      );
    });
  }

  public getController(name: string): ControllerInfo | undefined {
    return this.controllers.get(name);
  }

  public getAllControllers(): ControllerInfo[] {
    return Array.from(this.controllers.values());
  }
}
