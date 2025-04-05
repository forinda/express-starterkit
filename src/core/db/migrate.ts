// This file is commented out as we're using drizzle-kit commands instead
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { migrate } from 'drizzle-orm/node-postgres/migrator';
// import { Pool } from 'pg';
// import { ConfigService } from '@/common/config';
// import { join } from 'path';

// const configService = new ConfigService();
// const dbConfig = configService.getDbConfig();

// const pool = new Pool({
//   host: dbConfig.host,
//   port: dbConfig.port,
//   user: dbConfig.user,
//   password: dbConfig.password,
//   database: dbConfig.database,
// });

// const db = drizzle(pool);

// async function runMigrations() {
//   try {
//     console.log('Running migrations...');
//     await migrate(db, { migrationsFolder: join(__dirname, 'migrations') });
//     console.log('Migrations completed successfully');
//   } catch (error) {
//     console.error('Migration failed:', error);
//     process.exit(1);
//   } finally {
//     await pool.end();
//   }
// }

// // Run migration if this file is executed directly
// if (require.main === module) {
//   runMigrations();
// }

// export { runMigrations };
