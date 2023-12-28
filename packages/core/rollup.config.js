import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'TailwindCSSElements',
      },
      {
        file: 'dist/index.js',
        format: 'es',
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
];
