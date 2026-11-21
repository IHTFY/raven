// Builds the site and checks that it can be installed and played offline.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const out = mkdtempSync(join(tmpdir(), 'raven-pwa-'));
const read = (file) => readFileSync(join(out, file), 'utf8');

beforeAll(() => {
  const { VITEST, ...env } = process.env;
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', out, '--emptyOutDir'], {
    env,
    stdio: 'pipe',
  });
}, 120_000);
afterAll(() => rmSync(out, { recursive: true, force: true }));

describe('installable build', () => {
  it('links a manifest that names the app and declares icons that exist at their sizes', () => {
    expect(read('index.html')).toContain('<link rel="manifest" href="/manifest.webmanifest"');
    const manifest = JSON.parse(read('manifest.webmanifest'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.name).toBe('Raven');
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable' && icon.sizes === '512x512')).toBe(true);
    expect(manifest.icons.map((icon) => icon.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
    for (const icon of manifest.icons) {
      const file = join(out, icon.src);
      expect(existsSync(file)).toBe(true);
      const png = readFileSync(file);
      const [width, height] = [png.readUInt32BE(16), png.readUInt32BE(20)];
      expect(`${width}x${height}`).toBe(icon.sizes);
    }
  });

  it('writes a worker that precaches every built file but the host files', () => {
    const worker = read('sw.js');
    const precache = JSON.parse(/const PRECACHE = (\[.*\]);/.exec(worker)[1]);
    const built = readdirSync(out, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/${join(entry.parentPath, entry.name).slice(out.length + 1)}`)
      .filter((url) => url !== '/sw.js' && url !== '/CNAME' && url !== '/index.html' && !url.startsWith('/.'));
    expect(precache).toContain('/');
    expect(precache.filter((url) => url !== '/').sort()).toEqual(built.sort());
    expect(precache.some((url) => /^\/assets\/.+\.js$/.test(url))).toBe(true);
    expect(worker).not.toContain('__VERSION__');
    expect(worker).not.toContain('__PRECACHE__');
  });

  it('leaves other sites alone and registers the worker only in the production build', () => {
    expect(read('sw.js')).toContain('url.origin !== self.location.origin');
    expect(readFileSync('src/main.js', 'utf8')).toContain('import.meta.env.PROD');
  });
});
