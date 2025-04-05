import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function clean(): Promise<void> {
  await execAsync('rm -rf dist');
}

export default clean;
