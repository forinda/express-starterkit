import { z } from 'zod';

const validSortFields = ['id', 'name', 'email', 'created_at', 'updated_at'] as const;
const validSortOrders = ['asc', 'desc'] as const;

export const getUsersQuerySchema = z.object({
  sort: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return [];
      return val.split(',').map(item => {
        const [field, order] = item.split('=');
        const trimmedField = field.trim();
        const trimmedOrder = (order?.trim() || 'asc').toLowerCase();

        if (!validSortFields.includes(trimmedField as any)) {
          throw new Error(
            `Invalid sort field: ${trimmedField}. Valid fields are: ${validSortFields.join(', ')}`
          );
        }

        if (!validSortOrders.includes(trimmedOrder as any)) {
          throw new Error(
            `Invalid sort order: ${trimmedOrder}. Valid orders are: ${validSortOrders.join(', ')}`
          );
        }

        return {
          field: trimmedField,
          order: trimmedOrder as 'asc' | 'desc',
        };
      });
    }),
  q: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});
