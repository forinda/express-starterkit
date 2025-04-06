import { src, dest } from 'gulp';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import alias from 'gulp-ts-alias';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../');
console.log(`Base path: ${BASE_PATH}`); // Debugging line to check the base path

const tsProject = ts.createProject(path.join(BASE_PATH, 'tsconfig.json')); // Assuming this script is in the root

function build() {
  return src('src/**/*.ts')
    .pipe(alias({ cwd: path.join(__dirname, '..') })) // Correct alias usage
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
    .pipe(dest('dist'));
}

export default build;
