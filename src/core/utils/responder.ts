/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { HttpStatusCode } from '../constants/status-codes';
import { IResponse } from '../context/request';

export interface HttpResponse<T = any> {
  message?: string;
  data?: T;
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
