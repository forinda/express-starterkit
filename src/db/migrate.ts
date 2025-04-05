import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';

// For migrations
const migrationClient = new Pool({
  connectionString,
  max: 1
});

async function main() {
  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: './drizzle',
    });
    console.log('Migration completed successfully');
    await migrationClient.end(); // Remember to close the connection
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await migrationClient.end(); // Remember to close the connection
    process.exit(1);
  }
}

main();