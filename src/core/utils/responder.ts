/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { IResponse } from '../interfaces/http';
import { HttpStatusCode } from '../constants/status-codes';

export interface HttpResponse<T = any> {
  message?: string;
  data?: any;
  statusCode: HttpStatusCode;
}

export function createHttpResponse<T = any>(
  res: IResponse,
  { message, data, statusCode }: HttpResponse<T>
) {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
}
