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
    external: ['@ambiki/impulse'],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
  {
    input: './src/index.ts',
    output: [
      {
        name: 'TailwindCSSElements',
        file: 'dist/index.umd.js',
        format: 'umd',
        globals: {
          '@ambiki/impulse': 'Impulse',
        },
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  },
];
