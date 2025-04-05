import { injectable } from 'inversify';

export const DOMAIN_INJECTOR_KEYS = {
  controllers: Symbol.for('Domain:Controllers'),
};

type DomainModuleDecoratorOptions = {
  controllers?: any[];
};

export function DomainModule(options: DomainModuleDecoratorOptions = {}) {
  return function (target: any) {
    // injectable()(target);
    Reflect.defineMetadata(DOMAIN_INJECTOR_KEYS.controllers, options.controllers || [], target);
  };
}
