// import { Container, injectable, inject, interfaces } from 'inversify';

// const METADATA_KEY = {
//   DESIGN_TYPE: 'design:type',
//   INJECTABLE: 'inversify:injectable',
//   INJECT: 'inversify:inject',
//   LAZY_INJECT: 'inversify:lazy_inject',
//   FACTORY: 'inversify:factory',
//   SERVICE_IDENTIFIER: 'inversify:service_identifier',
//   SERVICE_IDENTIFIER_FACTORY: 'inversify:service_identifier_factory',
//   SERVICE_IDENTIFIER_LAZY: 'inversify:service_identifier_lazy',
//   SERVICE_IDENTIFIER_INJECT: 'inversify:service_identifier_inject',
//   SERVICE_IDENTIFIER_LAZY_INJECT: 'inversify:service_identifier_lazy_inject',
// } as const;

// export const container = new Container();

// // Scope types
// export enum Scope {
//   Singleton = 'Singleton',
//   Transient = 'Transient',
//   Request = 'Request'
// }

// // Service identifier type
// export type ServiceIdentifier<T = any> = interfaces.ServiceIdentifier<T>;

// // Singleton decorator
// export const Singleton = () => {
//   return (target: any) => {
//     injectable()(target);
//     const identifier = Symbol.for(target.name);
//     container.bind(identifier).to(target).inSingletonScope();
//     return target;
//   };
// };

// // Injectable decorator with scope
// export const Injectable = (scope: Scope = Scope.Transient) => {
//   return (target: any) => {
//     injectable()(target);
//     const identifier = Symbol.for(target.name);
//     const binding = container.bind(identifier).to(target);

//     switch (scope) {
//       case Scope.Singleton:
//         binding.inSingletonScope();
//         break;
//       case Scope.Request:
//         binding.inRequestScope();
//         break;
//       default:
//         binding.inTransientScope();
//     }

//     return target;
//   };
// };

// // Service decorator for automatic registration
// export const Service = (options: { scope?: Scope; name?: string } = {}) => {
//   return (target: any) => {
//     const identifier = Symbol.for(options.name || target.name);
//     const binding = container.bind(identifier).to(target);

//     switch (options.scope) {
//       case Scope.Singleton:
//         binding.inSingletonScope();
//         break;
//       case Scope.Request:
//         binding.inRequestScope();
//         break;
//       default:
//         binding.inTransientScope();
//     }

//     return target;
//   };
// };

// // Factory decorator
// export const Factory = <T>(factory: interfaces.FactoryCreator<T>) => {
//   return (target: any) => {
//     const identifier = Symbol.for(target.name);
//     container.bind<T>(identifier).toFactory(factory);
//     return target;
//   };
// };

// // Inject decorator with optional name
// export const Inject = (identifier?: ServiceIdentifier) => {
//   return (target: any, propertyKey: string | symbol, parameterIndex?: number) => {
//     const type = Reflect.getMetadata('design:type', target, propertyKey);
//     const actualIdentifier = identifier || Symbol.for(type.name);
//     inject(actualIdentifier)(target, propertyKey, parameterIndex);
//   };
// };

// // LazyInject decorator for property injection
// export const LazyInject = (identifier?: ServiceIdentifier) => {
//   return (target: any, propertyKey: string) => {
//     const type = Reflect.getMetadata('design:type', target, propertyKey);
//     const actualIdentifier = identifier || Symbol.for(type.name);

//     Object.defineProperty(target, propertyKey, {
//       get: () => container.get(actualIdentifier),
//       enumerable: true,
//       configurable: true,
//     });
//   };
// };
