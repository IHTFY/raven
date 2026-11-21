// @vitest-environment happy-dom
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';

let app;
let unmount;
let flushSync;
// The test DOM's animations reject when a puzzle or sheet is torn down mid-transition; the transitions are not what is under test.
const animate = Element.prototype.animate;
beforeAll(() => {
  Element.prototype.animate = () => ({ cancel() {}, finished: Promise.resolve(), currentTime: 0, effect: null });
});
afterAll(() => {
  Element.prototype.animate = animate;
});
/** The app state, the Quiz screen, and the copy of Svelte they share, fresh after a module reset. */
async function open() {
  const [state, quiz, svelte] = await Promise.all([import('../src/lib/state.svelte.js'), import('../src/lib/components/Quiz.svelte'), import('svelte')]);
  ({ unmount, flushSync } = svelte);
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

it('ignores a pick on a puzzle that has just appeared after an answer, by tap or key', async () => {
  const store = await open();
  const tapA = () => document.querySelector('button[aria-label="Option A"]').click();

  tapA();
  vi.advanceTimersByTime(280);
  flushSync();
  expect(store.test.current).toBe(1);
  expect(document.querySelector('.count').textContent).toContain('2 /');

  // A second tap of a double tap lands on the new puzzle before it can have been seen.
  tapA();
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
  expect(store.test.answers[1]).toBe(null);

  // A deliberate pick once the puzzle has settled still counts.
  vi.advanceTimersByTime(400);
  tapA();
  expect(store.test.answers[1]).toBe(0);
});

it('lets a pick through at once after moving with Next, since that puzzle was chosen by the player', async () => {
  const store = await open();

  document.querySelector('button[aria-label="Next puzzle"]').click();
  document.querySelector('button[aria-label="Option B"]').click();

  expect(store.test.current).toBe(1);
  expect(store.test.answers[1]).toBe(1);
});

it('saves a corrected answer made with Back right after an automatic advance', async () => {
  const store = await open();

  document.querySelector('button[aria-label="Option A"]').click();
  vi.advanceTimersByTime(280);
  expect(store.test.current).toBe(1);

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  document.querySelector('button[aria-label="Option C"]').click();

  expect(store.test.current).toBe(0);
  expect(store.test.answers[0]).toBe(2);
});

it('does not answer from a repeating key press', async () => {
  const store = await open();

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', repeat: true }));

  expect(store.test.answers[0]).toBe(null);
});

it('still saves an answer after the overview was opened and closed during the advance delay', async () => {
  const store = await open();

  document.querySelector('button[aria-label="Option A"]').click();
  vi.advanceTimersByTime(100);
  document.querySelector('button[aria-label="All puzzles"]').click();
  flushSync();
  vi.advanceTimersByTime(500);
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  flushSync();
  document.querySelector('button[aria-label="Option B"]').click();

  expect(store.test.current).toBe(0);
  expect(store.test.answers[0]).toBe(1);
});

it('keeps a guard that moving past the last puzzle did not end, and drops it when another tab changes the puzzle', async () => {
  const store = await open();
  const pick = (k) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k }));

  // Another tab moves this test to a different puzzle during the guard: a pick here is saved.
  pick('a');
  vi.advanceTimersByTime(280);
  expect(store.test.current).toBe(1);
  store.test.current = 5;
  pick('b');
  expect(store.test.answers[5]).toBe(1);

  // Right on the final puzzle changes nothing, so it keeps a guard in force there.
  store.test.current = 33;
  pick('c');
  vi.advanceTimersByTime(280);
  expect(store.test.current).toBe(34);
  pick('ArrowRight');
  pick('d');
  expect(store.test.answers[34]).toBe(null);
});
