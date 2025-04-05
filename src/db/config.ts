import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'pg';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

type DatabaseSchema = typeof schema;

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';

// Create a PostgreSQL client
const client =new postgres.Client(connectionString);

// Create a Drizzle instance
export const db = drizzle(client, { schema }) as PostgresJsDatabase<DatabaseSchema>;

// Export the schema for use in other files
export { schema }; 