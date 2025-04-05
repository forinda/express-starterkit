import { LoggerService } from '@/common/logger';
import { BaseControllerModule } from './controller-module';

export const API_MODULE_KEY = Symbol('api-module');

export interface ApiModuleMetadata {
  modules: (new () => BaseControllerModule)[];
}

export function ApiModule(metadata: ApiModuleMetadata) {
  return function (target: any) {
    const logger = new LoggerService();
    logger.debug(`[ApiModule] Registering API module ${target.name}`);

    // Store module metadata
    Reflect.defineMetadata(API_MODULE_KEY, metadata, target);

    return target;
  };
}
