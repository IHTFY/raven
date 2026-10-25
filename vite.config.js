import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  // Tests mount components, which needs Svelte's browser build rather than its server one.
  ...(process.env.VITEST && { resolve: { conditions: ['browser'] } }),
  test: {
    include: ['test/**/*.test.js'],
  },
});
