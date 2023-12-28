import { esbuildPlugin } from '@web/dev-server-esbuild';

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  rootDir: './packages/core',
  files: ['./packages/**/*.test.ts'],
  concurrentBrowsers: 3,
  nodeResolve: true,
  preserveSymlinks: true,
  testRunnerHtml: (testFramework) => `
    <html lang="en-US">
      <head></head>
      <body>
        <script type="module" src="dist/index.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};
