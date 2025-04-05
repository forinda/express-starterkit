import { HttpStatus } from "@/core/constants/status-codes";
import { IResponse } from "@/core/interfaces/http";
import { ApiError } from "../error/api-error";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: number;
    details?: any;
  };
  meta?: Record<string, any>;
}

export class ResponseFormatter {
  /**
   * Format a successful response
   */
  static success<T>(
    res: IResponse,
    data: T,
    meta?: Record<string, any>,
    statusCode: number = HttpStatus.OK
  ): IResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Format an error response
   */
  static error(
    res: IResponse,
    error: Error | ApiError,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
  ): IResponse {
    const isApiError = error instanceof ApiError;
    const response: ApiResponse = {
      success: false,
      error: {
        message: error.message,
        code: isApiError ? (error as ApiError).statusCode : statusCode,
        details: isApiError ? (error as ApiError).metadata : undefined
      }
    };

    return res.status(isApiError ? (error as ApiError).statusCode : statusCode).json(response);
  }

  /**
   * Format a paginated response
   */
  static paginated<T>(
    res: IResponse,
    data: T[],
    page: number,
    limit: number,
    total: number,
    meta?: Record<string, any>
  ): IResponse {
    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<T[]> = {
      success: true,
      data,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        ...meta
      }
    };

    return res.status(HttpStatus.OK).json(response);
  }
}
