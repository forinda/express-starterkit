import { Request, Response } from 'express';
import { PaginationOptions } from '../interfaces/pagination';

export interface RequestContext {
  request: Request;
  response: Response;
  params: Record<string, string>;
  query: Record<string, any>;
  body: any;
  user?: any; // For authentication
  pagination?: PaginationOptions;
  [key: string]: any; // For additional context properties
}

export class ExpressRequestContext implements RequestContext {
  constructor(
    public request: Request,
    public response: Response,
    public params: Record<string, string> = {},
    public query: Record<string, any> = {},
    public body: any = {},
    public user?: any,
    public pagination?: PaginationOptions
  ) {}
}
