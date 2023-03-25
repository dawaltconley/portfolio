import { defineConfig } from 'astro/config';
import path from 'node:path';
import preact from '@astrojs/preact';
import sass from 'sass';
import mkTailwindFunctions from 'sass-tailwind-functions';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

const tailwindFunctions = mkTailwindFunctions(
  sass,
  path.resolve('./tailwind.config.cjs')
);

const fapSvgPath = (type = '') =>
  path.join('node_modules', '@fortawesome', 'fontawesome-pro', 'svgs', type);
const fapSvgCallback = (svg) =>
  svg.replace(/^<svg /, '<svg fill="currentColor" ');

const fapCollection = Object.fromEntries(
  [
    'brands',
    'duotone',
    'light',
    'regular',
    'sharp-regular',
    'sharp-solid',
    'solid',
    'thin',
  ].map((type) => [
    `fap-${type}`,
    FileSystemIconLoader(fapSvgPath(type), fapSvgCallback),
  ])
);

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  vite: {
    plugins: [
      Icons({
        compiler: 'jsx',
        jsx: 'preact',
        customCollections: fapCollection,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src/styles'],
          quietDeps: true,
          functions: {
            ...tailwindFunctions,
          },
        },
      },
    },
  },
});
