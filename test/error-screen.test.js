// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';

let app;
let svelte;

/** The app on a fresh page, with the puzzle generator made to fail the way `broken` says. */
async function open({ hash = '', saved = null, broken = {} } = {}) {
  vi.resetModules();
  location.hash = hash;
  if (saved) localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, ...saved }));
  const fail = (what) => () => {
    throw new Error(`No puzzle found for seed ${what}`);
  };
  vi.doMock('../src/lib/engine/generate.js', async (importActual) => {
    const actual = await importActual();
    return { ...actual, ...(broken.test && { generateTest: fail('test') }), ...(broken.practice && { generatePuzzle: fail('practice') }) };
  });
  svelte = await import('svelte');
  const [{ default: App }, state] = await Promise.all([import('../src/App.svelte'), import('../src/lib/state.svelte.js')]);
  app = svelte.mount(App, { target: document.body });
  svelte.flushSync();
  return state;
}

const button = (name) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(name));
const aTest = (extra = {}) => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: Date.now(), deadline: Date.now() + 60_000, finished: null, ...extra });
const aResult = { seed: 'xyz', score: 20, total: TEST_LENGTH, seconds: 600, date: 5000 };

beforeEach(() => {
  localStorage.clear();
  document.head.innerHTML = '<meta name="theme-color" content="">';
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
});

afterEach(() => {
  if (app) svelte.unmount(app);
  app = null;
  document.body.innerHTML = '';
  vi.doUnmock('../src/lib/engine/generate.js');
  vi.restoreAllMocks();
});

describe('when a puzzle can’t be built', () => {
  it('opens a normal app when nothing fails', async () => {
    await open({ saved: { test: aTest() }, hash: '#/test/abc' });
    expect(document.body.textContent).not.toContain('Couldn’t build');
    expect(document.querySelector('.screen')).not.toBeNull();
  });

  it('shows a way out of a saved test that can’t be built, and the button clears it and goes home', async () => {
    const { store } = await open({ saved: { test: aTest(), history: [aResult] }, hash: '#/test/abc', broken: { test: true } });
    expect(document.body.textContent).toContain('Couldn’t build');
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.test).toBeNull();
    expect(store.history).toEqual([aResult]);
    expect(location.hash).toBe('#/');
    expect(document.body.textContent).not.toContain('Couldn’t build');
    expect(button('Take the test')).toBeDefined();
  });

  it('shows the same way out when a test left running has run out of time at startup', async () => {
    const { store } = await open({ saved: { test: aTest({ started: 1000, deadline: 2000 }) }, hash: '#/', broken: { test: true } });
    expect(document.body.textContent).toContain('Couldn’t build');
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.test).toBeNull();
    expect(button('Take the test')).toBeDefined();
  });

  it('shows the way out for a practice puzzle that can’t be built, and clears the practice', async () => {
    const { store } = await open({
      saved: { practice: { seed: 'def', count: 1, target: 2, right: 0, done: 1, choice: null, group: null } },
      hash: '#/practice',
      broken: { practice: true },
    });
    expect(document.body.textContent).toContain('Couldn’t build');
    button('Clear it and go home').click();
    svelte.flushSync();
    expect(store.practice).toBeNull();
    expect(location.hash).toBe('#/');
    expect(button('Take the test')).toBeDefined();
  });

  it('drops a running test that runs out while Home is open and can’t be scored', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
    const { store } = await open({ saved: { test: aTest({ deadline: Date.now() + 1500 }) }, hash: '#/', broken: { test: true } });
    expect(store.test).not.toBeNull();
    vi.advanceTimersByTime(2500);
    svelte.flushSync();
    expect(store.test).toBeNull();
    vi.useRealTimers();
  });
});
