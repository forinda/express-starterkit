import { src, dest } from 'gulp';
import ts from 'gulp-ts';

function build() {
  return src('src/**/*.ts')
    .pipe(
      ts({
        target: 'ES2020',
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: 'dist',
        rootDir: 'src',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
        },
      })
    )
    .pipe(dest('dist'));
}

export default build;
