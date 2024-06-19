import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { globbySync } from 'globby';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import copy from 'rollup-plugin-copy';

const production = process.env.NODE_ENV === 'production';
const exportPaths = [
  './src/elements/**/!(*.test).ts',
  './src/hooks/**/!(*.test).ts',
  './src/helpers/array.ts',
  './src/helpers/focus_trap.ts',
  './src/helpers/focus.ts',
  './src/helpers/scroll_lock.ts',
];

function pathEntries() {
  // Need to export these in package.json
  return Object.fromEntries(
    globbySync(exportPaths).map((file) => [
      path.relative('src', file.slice(0, file.length - path.extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ])
  );
}

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: {
      index: './src/index.ts',
      ...pathEntries(),
    },
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
        preserveModulesRoot: 'src',
      },
    ],
    external: ['@ambiki/impulse'],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.build.json' }),
      copy({
        targets: [
          { src: '../../README.md', dest: '.' },
          { src: '../../LICENSE.txt', dest: '.' },
        ],
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        name: 'TailwindCSSElements',
        file: 'dist/index.umd.js',
        format: 'umd',
      },
    ],
    plugins: [
      resolve({ browser: true }),
      typescript({ tsconfig: './tsconfig.build.json' }),
      ...(production ? [terser()] : []),
      copy({
        targets: [
          { src: '../../README.md', dest: '.' },
          { src: '../../LICENSE.txt', dest: '.' },
        ],
      }),
    ],
  },
];
