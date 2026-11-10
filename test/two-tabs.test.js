// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';

/** A fresh copy of the app state, loaded from whatever is in localStorage: one open tab. */
async function openTab() {
  vi.resetModules();
  // Closing a tab ends its listener; a test's earlier tabs must not hear the next test's events.
  const add = window.addEventListener.bind(window);
  vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'storage') listeners.push(listener);
    return add(type, listener, options);
  });
  // Each tab gets its own copy of Svelte too, so flushing has to use that copy.
  const [state, { flushSync, tick }] = await Promise.all([import('../src/lib/state.svelte.js'), import('svelte')]);
  // Let the first save run, as it long has in a tab that has been open a while.
  await tick();
  return { ...state, flushSync };
}

const aTest = (extra = {}) => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: 1000, deadline: 9e12, finished: null, ...extra });
const aResult = (date) => ({ seed: 'xyz', score: 1, total: 2, seconds: 5, date });
const anAttempt = (date) => ({ kind: 'tiles:xor', right: true, seconds: 3, target: 2, date });
const listeners = [];
const saved = () => JSON.parse(localStorage.getItem('raven'));

/** What another tab does: write its whole state, which makes the browser tell this tab. */
function otherTabWrites(state) {
  const value = JSON.stringify({ generator: GENERATOR, theme: null, test: null, history: [], practice: null, log: [], ...state });
  const oldValue = localStorage.getItem('raven');
  localStorage.setItem('raven', value);
  window.dispatchEvent(new StorageEvent('storage', { key: 'raven', oldValue, newValue: value, storageArea: localStorage }));
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  for (const listener of listeners.splice(0)) window.removeEventListener('storage', listener);
  vi.restoreAllMocks();
});

describe('two tabs', () => {
  it("keeps what another tab saved when this tab saves, whatever it changes", async () => {
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history: [aResult(9)], log: [anAttempt(1)] }));
    const { store, flushSync } = await openTab();
    const test = aTest({ answers: [2, ...Array(TEST_LENGTH - 1).fill(null)] });
    otherTabWrites({ history: [aResult(10), aResult(9)], log: [anAttempt(2), anAttempt(1)], test });

    store.theme = 'dark';
    flushSync();

    expect(saved().history.map((h) => h.date)).toEqual([10, 9]);
    expect(saved().log.map((a) => a.date)).toEqual([2, 1]);
    expect(saved().test.answers[0]).toBe(2);
    expect(saved().theme).toBe('dark');
  });

  it('merges results both tabs finished, with every date once', async () => {
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history: [aResult(9)] }));
    const { store, flushSync } = await openTab();
    store.history = [aResult(11), ...store.history];
    flushSync();
    // The other tab never saw 11; it finished a test at 10 and still holds 9.
    otherTabWrites({ history: [aResult(10), aResult(9)] });
    store.theme = 'light';
    flushSync();
    expect(saved().history.map((h) => h.date)).toEqual([11, 10, 9]);
    expect(store.history.map((h) => h.date)).toEqual([11, 10, 9]);
  });

  it('keeps a different test running in this tab', async () => {
    const { startTest, store, flushSync } = await openTab();
    startTest('mine');
    flushSync();
    otherTabWrites({ test: aTest({ seed: 'theirs' }), history: [aResult(10)] });
    expect(store.test.seed).toBe('mine');
    expect(store.history.map((h) => h.date)).toEqual([10]);
    store.theme = 'dark';
    flushSync();
    expect(saved().test.seed).toBe('mine');
    expect(saved().history.map((h) => h.date)).toEqual([10]);
  });

  it('follows the same test when the other tab answers or finishes it', async () => {
    const { startTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    const started = store.test.started;
    const answers = [3, ...Array(TEST_LENGTH - 1).fill(null)];
    otherTabWrites({ test: aTest({ started, answers }) });
    expect(store.test.answers[0]).toBe(3);
    otherTabWrites({ test: aTest({ started, answers, finished: started + 5 }), history: [aResult(started + 5)] });
    expect(store.test.finished).toBe(started + 5);
  });

  it('ignores other keys, a damaged value, and a save from another generator', async () => {
    const { store, flushSync } = await openTab();
    window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: JSON.stringify({ theme: 'dark' }), storageArea: localStorage }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: '{"history":', storageArea: localStorage }));
    expect(store.theme).toBe(null);
    otherTabWrites({ generator: GENERATOR - 1, test: aTest(), history: [aResult(10)] });
    expect(store.test).toBe(null);
    expect(store.history.map((h) => h.date)).toEqual([10]);
  });
});
