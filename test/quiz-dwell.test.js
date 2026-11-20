// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

let app;
let unmount;
/** The app state, the Quiz screen, and the copy of Svelte they share, fresh after a module reset. */
async function open() {
  const [state, quiz, svelte] = await Promise.all([import('../src/lib/state.svelte.js'), import('../src/lib/components/Quiz.svelte'), import('svelte')]);
  ({ unmount } = svelte);
  state.startTest('abc');
  app = svelte.mount(quiz.default, { target: document.body });
  svelte.flushSync();
  return state.store;
}
beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
  vi.useFakeTimers({ toFake: ['Date', 'performance', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });
});
afterEach(() => {
  if (app) unmount(app);
  app = null;
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('saves the time on the current puzzle when the page is hidden for a reload', async () => {
  const store = await open();

  vi.advanceTimersByTime(3000);
  window.dispatchEvent(new Event('pagehide'));

  expect(JSON.parse(localStorage.getItem('raven')).test.times[0]).toBe(3);
  expect(store.test.times[0]).toBe(3);

  // The reloaded page starts a new visit; leaving it counts only the time since the reload.
  vi.advanceTimersByTime(1000);
  unmount(app);
  app = null;
  expect(store.test.times[0]).toBe(4);
});

it('saves the time when the tab goes to the background', async () => {
  const store = await open();

  vi.advanceTimersByTime(2000);
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  document.dispatchEvent(new Event('visibilitychange'));

  expect(JSON.parse(localStorage.getItem('raven')).test.times[0]).toBe(2);
  expect(store.test.times[0]).toBe(2);
});

it('does not count the time a tab spends in the background when it is then closed', async () => {
  const store = await open();

  vi.advanceTimersByTime(2000);
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  document.dispatchEvent(new Event('visibilitychange'));
  vi.advanceTimersByTime(60000);
  window.dispatchEvent(new Event('pagehide'));
  expect(store.test.times[0]).toBe(2);

  // Shown again, counting restarts from that moment.
  visibility.mockReturnValue('visible');
  document.dispatchEvent(new Event('visibilitychange'));
  vi.advanceTimersByTime(1000);
  window.dispatchEvent(new Event('pagehide'));
  expect(store.test.times[0]).toBe(3);
});

it('never saves more time on a puzzle than a save may hold', async () => {
  const store = await open();

  store.test.times[0] = 24 * 60 * 60 - 1;
  vi.advanceTimersByTime(5000);
  window.dispatchEvent(new Event('pagehide'));

  expect(store.test.times[0]).toBe(24 * 60 * 60);
});

it('does not count background time when the test times out while hidden', async () => {
  const store = await open();

  vi.advanceTimersByTime(2000);
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  document.dispatchEvent(new Event('visibilitychange'));
  vi.advanceTimersByTime(60000);
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  vi.advanceTimersByTime(1000);
  unmount(app);
  app = null;

  expect(store.test.times[0]).toBe(2);
  expect(store.test.times[1]).toBe(0);
});

it('does not count the time of a quiz that opened and closed in a background tab', async () => {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
  const store = await open();

  vi.advanceTimersByTime(5000);
  window.dispatchEvent(new Event('pagehide'));

  expect(store.test.times[0]).toBe(0);
});
