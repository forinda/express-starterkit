import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/core/db/schema',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    // ssl: process.env.DB_SSL === 'false',
  },
});
