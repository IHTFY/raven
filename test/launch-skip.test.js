// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

// The launch script in index.html's head, the one that defines window.launchExit.
const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), 'utf8');
const launchScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((code) => code.includes('launchExit'));

let animation;
let settle;

beforeEach(() => {
  window.happyDOM.setViewport({ width: 360, height: 722 });
  document.body.innerHTML = '<div id="launch"></div><div id="app"></div>';
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({ matches: query === '(display-mode: standalone)' }));
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([{ type: 'navigate' }]);
  animation = { finish: vi.fn(), finished: new Promise((resolve) => (settle = resolve)) };
  // Runs in the page's global scope, as the inline script does.
  (0, eval)(launchScript);
  window.launchExit(() => [animation]);
});

afterEach(async () => {
  // Ending the motion ends the launch, which removes the copy and the listeners it added.
  settle();
  await vi.waitFor(() => expect(document.getElementById('launch')).toBeNull());
  sessionStorage.clear();
  document.documentElement.classList.remove('launching');
  delete window.launchExit;
  vi.restoreAllMocks();
});

it('keeps playing through a resize that leaves the window its size', () => {
  // Chrome sends one as the installed app starts, often after the exit has begun.
  dispatchEvent(new Event('resize'));
  expect(animation.finish).not.toHaveBeenCalled();
});

it('skips to the end when the window turns', () => {
  window.happyDOM.setViewport({ width: 722, height: 360 });
  dispatchEvent(new Event('resize'));
  expect(animation.finish).toHaveBeenCalled();
});

it('skips to the end on a tap', () => {
  document.getElementById('launch').dispatchEvent(new Event('pointerdown'));
  expect(animation.finish).toHaveBeenCalled();
});
