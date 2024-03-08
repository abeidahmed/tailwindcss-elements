// https://github.com/tailwindlabs/headlessui/blob/main/playgrounds/vue/src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router';
import { Component } from 'vue';

function titleCase(str: string) {
  return str
    .toLocaleLowerCase()
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const files = Object.entries(import.meta.glob('./pages/**/*.vue', { eager: true, import: 'default' }));
const normalizedFiles = files.map(([file, component]) => [
  file
    .replace('./pages/', '/')
    .replace(/\.vue$/, '')
    .toLocaleLowerCase()
    .replace(/^\/home$/g, '/'),
  component,
]) as [string, Component][];

const addedRoutes = new Set();

const fileRoutes = normalizedFiles.flatMap((entry) => {
  const dirs = (entry[0] as string).split('/').slice(1, -1);
  const paths: [string, Component][] = [];

  for (const [idx] of dirs.entries()) {
    const path = `/` + dirs.slice(0, idx + 1).join('/');
    if (addedRoutes.has(path)) {
      continue;
    }

    paths.push([path, RouterView]);
    addedRoutes.add(path);
  }

  return [...paths, entry].sort((a, b) => a[0].localeCompare(b[0]));
});

const routes: RouteRecordRaw[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routesByPath: Record<string, any> = {};

for (const [path, component] of fileRoutes) {
  const prefix = path.split('/').slice(0, -1).join('/');
  const parent = routesByPath[prefix]?.children ?? routes;
  const route = {
    path,
    component: component,
    children: [],
    meta: {
      name: titleCase(path.match(/[^/]+$/)?.[0] ?? 'Home'),
      isRoot: parent === routes,
    },
  };

  parent.push((routesByPath[path] = route));
}

export default createRouter({
  history: createWebHistory(),
  routes,
});
