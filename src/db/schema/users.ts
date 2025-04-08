import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const genderType = pgEnum('user_gender_enum', ['Male', 'Female', 'Other']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  gender: genderType().default('Other'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type UserInsertType = typeof users.$inferInsert;
export type UserSelectType = typeof users.$inferSelect;
