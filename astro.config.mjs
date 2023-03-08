import { defineConfig } from 'astro/config';
import path from 'node:path';
import sass from 'sass';
import react from '@astrojs/react';
import mkTailwindFunctions from 'sass-tailwind-functions';

const tailwindFunctions = mkTailwindFunctions(
  sass,
  path.resolve('./tailwind.config.cjs')
);

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
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
