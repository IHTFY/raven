// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';

let app;
let svelte;
const animate = Element.prototype.animate;

/** The app on a fresh page, with the puzzle generator made to fail for the seeds in `broken`. */
async function open({ hash = '', saved = null, broken = [] } = {}) {
  vi.resetModules();
  location.hash = hash;
  if (saved) localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, ...saved }));
  vi.doMock('../src/lib/engine/generate.js', async (importActual) => {
    const actual = await importActual();
    return {
      ...actual,
      testBuilder: (seed) =>
        broken.includes(seed)
          ? () => {
              throw new Error(`No puzzle found for seed ${seed}`);
            }
          : actual.testBuilder(seed),
    };
  });
  svelte = await import('svelte');
  const [{ default: App }, state] = await Promise.all([import('../src/App.svelte'), import('../src/lib/state.svelte.js')]);
  app = svelte.mount(App, { target: document.body });
  svelte.flushSync();
  return state;
}

const button = (name) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(name));
const running = () => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 3, started: Date.now(), deadline: Date.now() + 600_000, finished: null });
const past = { seed: 'xyz', score: 0, total: TEST_LENGTH, seconds: 600, date: 5000, answers: Array(TEST_LENGTH).fill(null), generator: GENERATOR };

beforeEach(() => {
  Element.prototype.animate = () => ({ cancel() {}, finished: Promise.resolve(), currentTime: 0, effect: null });
  localStorage.clear();
  document.head.innerHTML = '<meta name="theme-color" content="">';
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
});

afterEach(() => {
  Element.prototype.animate = animate;
  if (app) svelte.unmount(app);
  app = null;
  document.body.innerHTML = '';
  vi.doUnmock('../src/lib/engine/generate.js');
  vi.restoreAllMocks();
});

describe('a past result while another test is running', () => {
  it('asks for a second tap before New test replaces the running test', async () => {
    const test = running();
    const { store } = await open({ saved: { test, history: [past] }, hash: '#/history/5000/xyz' });
    expect(button('New test')).toBeDefined();
    button('New test').click();
    svelte.flushSync();
    expect(store.test.seed).toBe('abc');
    expect(store.test.current).toBe(3);
    expect(button('Tap again to start over')).toBeDefined();
    button('Tap again to start over').click();
    svelte.flushSync();
    expect(store.test.seed).not.toBe('abc');
    expect(location.hash).toBe(`#/test/${store.test.seed}`);
  });

  it('starts a new test on the first tap when none is running', async () => {
    const { store } = await open({ saved: { history: [past] }, hash: '#/history/5000/xyz' });
    button('New test').click();
    svelte.flushSync();
    expect(store.test).not.toBeNull();
    expect(location.hash).toBe(`#/test/${store.test.seed}`);
  });

  it('keeps the running test when the past result can’t be rebuilt, and goes home', async () => {
    const test = running();
    const { store } = await open({ saved: { test, history: [past] }, hash: '#/history/5000/xyz', broken: ['xyz'] });
    expect(document.body.textContent).toContain('Couldn’t build');
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.test).toEqual(test);
    expect(store.history).toHaveLength(1);
    expect(location.hash).toBe('#/');
    expect(button('Resume test')).toBeDefined();
  });

  it('asks again when another tab replaced the running test after the first tap', async () => {
    const { store } = await open({ saved: { test: running(), history: [past] }, hash: '#/history/5000/xyz' });
    button('New test').click();
    svelte.flushSync();
    expect(button('Tap again to start over')).toBeDefined();
    const other = { ...running(), seed: 'def', started: Date.now() + 5 };
    store.test = other;
    svelte.flushSync();
    expect(button('New test')).toBeDefined();
    button('New test').click();
    svelte.flushSync();
    expect(store.test).toEqual(other);
    expect(button('Tap again to start over')).toBeDefined();
  });

  it('keeps the running test when you go Back home before tapping Clear it', async () => {
    const test = running();
    const { store } = await open({ saved: { test, history: [past] }, hash: '#/history/5000/xyz', broken: ['xyz'] });
    expect(document.body.textContent).toContain('Couldn’t build');
    const { go } = await import('../src/lib/router.svelte.js');
    go();
    svelte.flushSync();
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.test).toEqual(test);
  });

  it('still clears a saved test that can’t be scored at startup when the URL is a past result', async () => {
    const { store } = await open({ saved: { test: { ...running(), started: 1000, deadline: 2000 }, history: [past] }, hash: '#/history/5000/xyz', broken: ['abc'] });
    expect(document.body.textContent).toContain('Couldn’t build');
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.test).toBeNull();
    expect(store.history).toHaveLength(1);
  });
});
