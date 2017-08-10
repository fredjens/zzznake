import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    serve(),
    livereload('build'),
  ],
  dest: 'build/bundle.js',
};