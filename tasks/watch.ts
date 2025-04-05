import { watch as gulpWatch } from 'gulp';
import build from './build';

function watch(): void {
  gulpWatch('src/**/*.ts', build);
}

export default watch;
