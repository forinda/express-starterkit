import { RequestHandler } from 'express';
import { ContextTransformer } from './context';
import { MethodProps } from '../context/request';

export interface RouteMetadata<B = any, Q = any, P = any> {
  method: string;
  path: string;
  handlerName: string;
  transformer?: ContextTransformer<B, Q, P>;
  options?: MethodProps<B, Q, P>;
}

export interface ControllerMetadata {
  basePath: string;
  middlewares?: RequestHandler[];
}

export interface ControllerInfo extends ControllerMetadata {
  target: any;
  router: any;
  version?: string;
  path?: string;
  routes: RouteMetadata[];
  middlewares?: RequestHandler[];
}

export type ControllerOptions = {
  middlewares?: RequestHandler[];
};
