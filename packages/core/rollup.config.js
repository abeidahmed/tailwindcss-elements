import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: ['./src/index.ts'],
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [resolve(), typescript({ tsconfig: './tsconfig.build.json' })],
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
    plugins: [resolve({ browser: true }), typescript({ tsconfig: './tsconfig.build.json' })],
  },
];
