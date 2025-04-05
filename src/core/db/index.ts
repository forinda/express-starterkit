/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type Db = typeof db;
export type DbPool = Pool;
export type DbTransactionPool = Parameters<ReturnType<typeof drizzle>['transaction']>[0];
