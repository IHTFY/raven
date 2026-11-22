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

const tap = (target, init = {}) => target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isPrimary: true, button: 0, pointerType: 'touch', ...init }));
const click = (target) => target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

// A control under the copy, the way Home's buttons sit under it.
function control() {
  const button = document.createElement('button');
  const pressed = vi.fn();
  button.addEventListener('pointerdown', pressed);
  button.addEventListener('click', pressed);
  document.getElementById('app').append(button);
  return { button, pressed };
}

it('keeps a tap that skips from pressing the control under it once the copy has gone', async () => {
  const { button, pressed } = control();
  tap(document.getElementById('launch'));
  expect(animation.finish).toHaveBeenCalled();
  settle();
  await vi.waitFor(() => expect(document.getElementById('launch')).toBeNull());
  // The touch's click arrives after the launch ended, aimed at whatever is under the finger.
  click(button);
  expect(pressed).not.toHaveBeenCalled();
  // The next tap is the player's own.
  tap(button);
  click(button);
  expect(pressed).toHaveBeenCalledTimes(2);
});

it('lets the next press through when the skip ended without a click', async () => {
  const { button, pressed } = control();
  tap(document.getElementById('launch'));
  settle();
  await vi.waitFor(() => expect(document.getElementById('launch')).toBeNull());
  // A drag, or a mouse press that lost its click with the copy: the guard must not take the next click.
  tap(button, { pointerType: 'mouse' });
  click(button);
  expect(pressed).toHaveBeenCalledTimes(2);
});

it('drops the guard a second after the skip', async () => {
  vi.useFakeTimers();
  try {
    const { button, pressed } = control();
    tap(document.getElementById('launch'));
    vi.advanceTimersByTime(1000);
    click(button);
    expect(pressed).toHaveBeenCalledTimes(1);
  } finally {
    vi.useRealTimers();
  }
});

it('skips on a key and keeps it from the page', () => {
  const pressed = vi.fn();
  document.addEventListener('keydown', pressed);
  const key = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  document.body.dispatchEvent(key);
  document.removeEventListener('keydown', pressed);
  expect(animation.finish).toHaveBeenCalled();
  expect(key.defaultPrevented).toBe(true);
  expect(pressed).not.toHaveBeenCalled();
});
