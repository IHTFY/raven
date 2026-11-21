import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const SKIP = new Set(['CNAME', 'sw.js']);

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

// Writes dist/sw.js from src/sw.js, listing every built file to precache. The version is a hash of
// their contents, so any change to the site gives the worker a new cache and retires the old one.
function serviceWorker() {
  let outDir;
  return {
    name: 'raven-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files = listFiles(outDir)
        .map((file) => relative(outDir, file).split('\\').join('/'))
        .filter((file) => !SKIP.has(file) && !file.startsWith('.'))
        .sort();
      const hash = createHash('sha256');
      for (const file of files) hash.update(file).update(readFileSync(join(outDir, file)));
      const urls = ['/', ...files.filter((file) => file !== 'index.html').map((file) => `/${file}`)];
      const source = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf8')
        .replace('__VERSION__', hash.digest('hex').slice(0, 12))
        .replace('__PRECACHE__', JSON.stringify(urls));
      writeFileSync(join(outDir, 'sw.js'), source);
    },
  };
}

export default defineConfig({
  plugins: [svelte(), serviceWorker()],
  // Tests mount components, which needs Svelte's browser build rather than its server one.
  ...(process.env.VITEST && { resolve: { conditions: ['browser'] } }),
  test: {
    include: ['test/**/*.test.js'],
  },
});
