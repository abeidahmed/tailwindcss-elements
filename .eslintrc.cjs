'use strict';

module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  reportUnusedDisableDirectives: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: { browser: true },
  overrides: [
    {
      files: ['packages/**/*.test.ts'],
      globals: { describe: true, it: true, beforeEach: true },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: [
        '.eslintrc.cjs',
        '.prettierrc.cjs',
        'rollup.config.js',
        'web-test-runner.config.js',
        'tailwind.config.cjs',
      ],
      env: {
        node: true,
      },
    },
  ],
  rules: {
    'prettier/prettier': ['error'],
    'vue/multi-word-component-names': 'off',
  },
};
