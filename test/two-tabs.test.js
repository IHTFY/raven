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
  vi.unstubAllGlobals();
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

  it('doesn’t write over a save it failed to read', async () => {
    const value = JSON.stringify({ generator: GENERATOR, history: [aResult(9)] });
    localStorage.setItem('raven', value);
    // Reading fails once while writing works. The test DOM's storage caches its methods, so swap in a stand-in rather than spy on them.
    const real = localStorage;
    let reads = 0;
    vi.stubGlobal('localStorage', {
      getItem(key) {
        if (reads++ === 0) throw new Error('blocked');
        return real.getItem(key);
      },
      setItem: (key, v) => real.setItem(key, v),
    });
    const { store, flushSync } = await openTab();
    store.theme = 'dark';
    flushSync();
    expect(real.getItem('raven')).toBe(value);
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

  it('a queued save cannot reopen a test just finished in this tab', async () => {
    const { startTest, finishTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    const earlier = localStorage.getItem('raven');
    finishTest();
    flushSync();
    const finished = store.test.finished;
    window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: earlier, storageArea: localStorage }));
    flushSync();
    expect(store.test.finished).toBe(finished);
    expect(saved().test.finished).toBe(finished);
  });

  it('writes the finished test over an older copy a closed tab left in storage', async () => {
    const { startTest, finishTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    const { seed, started } = store.test;
    finishTest();
    flushSync();
    const finished = store.test.finished;
    // The other tab saved its copy of the unfinished test and closed before hearing of the finish.
    otherTabWrites({ test: aTest({ seed, started }) });
    expect(store.test.finished).toBe(finished);
    expect(saved().test.finished).toBe(finished);
    expect(saved().history).toHaveLength(1);
  });

  it('repairs the stored finished test with the merged practice, not the stale one', async () => {
    const { startTest, finishTest, startPractice, store, flushSync } = await openTab();
    startTest('abc');
    startPractice();
    flushSync();
    const { seed, started } = store.test;
    finishTest();
    flushSync();
    const finished = store.test.finished;
    // The other tab's stale copy still has the test running, but its practice is further along.
    otherTabWrites({ test: aTest({ seed, started }), practice: { ...store.practice, done: 5, right: 3 } });
    // Right away, before any later save: the first write back already holds both.
    expect(saved().test.finished).toBe(finished);
    expect(saved().practice.done).toBe(5);
  });

  it('merges a stale save even when storage cannot be read back', async () => {
    const { startTest, finishTest, startPractice, store, flushSync } = await openTab();
    startTest('abc');
    startPractice();
    flushSync();
    const { seed, started } = store.test;
    finishTest();
    flushSync();
    const stale = JSON.stringify({ generator: GENERATOR, theme: null, test: aTest({ seed, started }), history: [], practice: { ...store.practice, done: 5, right: 3 }, log: [] });
    const read = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: stale, storageArea: localStorage }));
      expect(store.practice.done).toBe(5);
    } finally {
      read.mockRestore();
    }
  });

  it('still takes a new test another tab started after this one finished', async () => {
    const { startTest, finishTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    finishTest();
    flushSync();
    const started = store.test.started + 1000;
    otherTabWrites({ test: aTest({ seed: 'abc', started }) });
    expect(store.test.finished).toBe(null);
    expect(store.test.started).toBe(started);
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
