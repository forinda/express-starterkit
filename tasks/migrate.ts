import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate(): Promise<void> {
  try {
    console.log('Running database migrations...');
    await execAsync('drizzle-kit migrate');
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export default migrate;
