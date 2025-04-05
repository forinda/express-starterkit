import { Response, Request, NextFunction } from 'express';

export interface IResponse extends Response {}
export interface IRequest extends Request {
  user?: any; // Replace 'any' with the actual type of your user object
}
export interface INextFunction extends NextFunction {}
