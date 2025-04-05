/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type UserInsertType = typeof users.$inferInsert;
export type UserSelectType = typeof users.$inferSelect;
