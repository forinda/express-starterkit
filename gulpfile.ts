import { series, task } from 'gulp';
import clean from './tasks/clean';
import build from './tasks/build';
import migrate from './tasks/migrate';
import watch from './tasks/watch';

// Define task types
// type GulpTask = TaskFunction | TaskFunction[];

// Define task dependencies
task('clean', clean);
task('build', series('clean', build));
task('migrate', migrate);
task('watch', series('build', watch));
task('default', series('build'));

// Export tasks for npm scripts
export { clean, build, migrate, watch };
export default series('build');
