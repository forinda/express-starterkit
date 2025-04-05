/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { z } from 'zod';

export class SchemaValidator {
  validate<T>(schema: z.Schema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation failed: ${error.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join(', ')}`
        );
      }
      throw error;
    }
  }
}
