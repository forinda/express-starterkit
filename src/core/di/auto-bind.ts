import { injectable } from 'inversify';
import { di } from './container';
export interface AutoRegisterOptions {
  singleton?: boolean;
  useClass?: any;
  token?: symbol;
  autoBind?: boolean;
}
export const TYPES = {
  LoggerService: Symbol.for('LoggerService'),
  ConfigService: Symbol.for('ConfigService'),
  AppSetup: Symbol.for('AppSetup'),
  // Add more service types as needed
};

/**
 * Decorator to automatically register a class with inversify
 * @param options Registration options
 */
export function AutoBindDep(options: AutoRegisterOptions = {}) {
  return function (target: any) {
    console.log('AutoBindDep', target.name);

    // Determine the token to use
    const token = options.token || Symbol.for(target.name);

    // Register the class based on options
    if (options.useClass) {
      di.bind(token).to(options.useClass);
    } else {
      di.bind(token).to(target);
    }

    // Apply singleton scope if specified
    if (options.singleton) {
      di.bind(token).to(target).inSingletonScope();
    }

    // Add the token to TYPES for easy access
    (TYPES as Record<string, symbol>)[target.name] = token;
    console.log('Binding');

    // If autoBind is enabled, automatically bind dependencies
    if (options.autoBind) {
      const paramTypes = Reflect.getMetadata('design:paramtypes', target);
      if (paramTypes) {
        paramTypes.forEach((paramType: any, index: number) => {
          if (paramType && paramType.name !== 'Object') {
            const paramToken = Symbol.for(paramType.name);
            di.bind(paramToken).to(paramType);
          }
        });
      }
    }

    return target;
  };
}
