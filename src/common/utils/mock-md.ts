import { IRequest, IResponse, INextFunction } from '@/core/context/request';

export const generateMiddleware = (message: string, count: number) => {
  return Array.from({ length: count }).map((_, index) => {
    return (_request: IRequest, response: IResponse, nextF: INextFunction) => {
      console.log(`Middleware executed: ${message}: ${count}`);
      nextF();
    };
  });
};
