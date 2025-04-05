import { z } from 'zod';

export const getUsersQuerySchema = z
  .object({
    sortBy: z.enum(['id', 'name', 'email', 'created_at', 'updated_at']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    q: z.string().optional(),
  })
  .strict();
