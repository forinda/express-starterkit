import { HttpStatus, HttpStatusCode } from '@/core/constants/status-codes';
import { ZodError } from 'zod';

export interface ErrorMetadata {
  [key: string]: any;
}

export class ApiError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly metadata?: ErrorMetadata;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    metadata?: ErrorMetadata,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.isOperational = isOperational;
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      metadata: this.metadata,
      stack: this.stack,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  static fromError(error: Error): ApiError {
    return new ApiError(error.message, HttpStatus.INTERNAL_SERVER_ERROR, undefined, false, {
      stack: error.stack,
    });
  }

  static fromZodError(
    error: ZodError,
    statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST,
    metadata?: ErrorMetadata
  ): ApiError {
    const details = error.errors.reduce(
      (acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      },
      {} as Record<string, any>
    );

    return new ApiError(error.message, statusCode, metadata, false, details);
  }
}
