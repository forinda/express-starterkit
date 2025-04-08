/**
 * Copyright (c) 2025 Felix Orinda
 * All rights reserved.
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@/common/config';
import { di } from '@/core/di/container';
const consf = di.get<ConfigService>(Symbol.for('ConfigService'));
const config = consf.getDatabaseConfig();

const pool = new Pool(config);

export const db = drizzle(pool, { schema });

export type Db = typeof db;
export type DbPool = Pool;
export type DbTransactionPool = Parameters<ReturnType<typeof drizzle>['transaction']>[0];
