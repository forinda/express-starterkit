import 'reflect-metadata';
import { Container } from 'inversify';
import { injectable } from 'inversify';

// Create container
export const di = new Container({ autoBindInjectable: true });

// Type to store all registered tokens
const registeredTokens = new Map<string, symbol>();

/**
 * Get or create a token for a class
 */
function getToken<T>(target: new (...args: any[]) => T): symbol {
  const className = target.name;
  if (!registeredTokens.has(className)) {
    registeredTokens.set(className, Symbol.for(className));
  }
  return registeredTokens.get(className)!;
}

/**
 * Decorator to automatically register a class as a singleton with inversify
 */
export function Singleton<T>() {
  return function (target: new (...args: any[]) => T) {
    console.debug(`[Singleton] Registering ${target.name} as singleton`);

    // Make the class injectable
    injectable()(target);

    // Get the token
    const token = getToken(target);

    // Bind the class as a singleton
    di.bind<T>(token).to(target).inSingletonScope();

    return target;
  };
}

/**
 * Decorator to automatically register a class with inversify
 */
export function Injectable<T>() {
  return function (target: new (...args: any[]) => T) {
    console.debug(`[Injectable] Registering ${target.name}`);

    // Make the class injectable
    injectable()(target);

    // Get the token
    const token = getToken(target);

    // Bind the class
    di.bind<T>(token).to(target);

    return target;
  };
}

/**
 * Helper to resolve a service from the container
 */
export function resolve<T>(target: new (...args: any[]) => T): T {
  console.debug(`[Container] Resolving ${target.name}`);
  return di.get<T>(getToken(target));
}
