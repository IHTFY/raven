// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';

const add = window.addEventListener.bind(window);

/** A fresh copy of the app state, loaded from whatever is in localStorage: one open tab. */
async function openTab() {
  vi.resetModules();
  // Closing a tab ends its listener; a test's earlier tabs must not hear the next test's events.
  const heard = [];
  vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'storage') {
      listeners.push(listener);
      heard.push(listener);
    }
    return add(type, listener, options);
  });
  // Each tab gets its own copy of Svelte too, so flushing has to use that copy.
  const [state, { flushSync, tick }] = await Promise.all([import('../src/lib/state.svelte.js'), import('svelte')]);
  // Let the first save run, as it long has in a tab that has been open a while.
  await tick();
  /** The browser tells this tab alone that another tab saved `newValue`: by default, what storage holds now. */
  const hear = (newValue = localStorage.getItem('raven')) => {
    for (const listener of heard) listener(new StorageEvent('storage', { key: 'raven', newValue, storageArea: localStorage }));
    flushSync();
  };
  return { ...state, flushSync, hear };
}

const aTest = (extra = {}) => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: 1000, deadline: 9e12, finished: null, ...extra });
const aResult = (date) => ({ seed: 'xyz', score: 1, total: 2, seconds: 5, date });
const anAttempt = (date) => ({ kind: 'tiles:xor', right: true, seconds: 3, target: 2, date });
const aPractice = (extra = {}) => ({ seed: 'def', count: 3, target: 2.2, right: 2, done: 3, choice: null, group: null, ...extra });
const listeners = [];
const saved = () => JSON.parse(localStorage.getItem('raven'));
const whole = (state) => JSON.stringify({ generator: GENERATOR, theme: null, test: null, history: [], practice: null, log: [], ...state });
const answers = (...given) => [...given, ...Array(TEST_LENGTH - given.length).fill(null)];

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
  vi.useRealTimers();
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
    // The test the other tab started is the saved one now; this tab's plays on without replacing it.
    expect(store.test.seed).toBe('mine');
    expect(saved().test.seed).toBe('theirs');
    expect(saved().theme).toBe('dark');
    expect(saved().history.map((h) => h.date)).toEqual([10]);
  });

  it('keeps the tests both tabs started, and only well-formed ones from a save', async () => {
    localStorage.setItem('raven', whole({ begun: [{ seed: 'old', date: 5, generator: GENERATOR }, { seed: 'bad seed', date: 6, generator: GENERATOR }, { seed: 'nodate', generator: GENERATOR }] }));
    const { startTest, store, flushSync } = await openTab();
    expect(store.begun.map((b) => b.seed)).toEqual(['old']);
    startTest('mine');
    flushSync();
    otherTabWrites({ begun: [{ seed: 'theirs', date: 7, generator: GENERATOR }, { seed: 'old', date: 5, generator: GENERATOR }] });
    store.theme = 'dark';
    flushSync();
    expect(store.begun.map((b) => b.seed)).toEqual(['mine', 'theirs', 'old']);
    expect(saved().begun.map((b) => b.seed)).toEqual(['mine', 'theirs', 'old']);
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

  it('merges what storage holds now when an event for an older save arrives late', async () => {
    const { startTest, finishTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    const { seed, started } = store.test;
    finishTest();
    flushSync();
    // Another tab started a new test since, and saved it; this tab has not heard of that yet.
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, theme: null, test: aTest({ seed: 'new', started: started + 5000, answers: [3, ...Array(TEST_LENGTH - 1).fill(null)] }), history: [], practice: null, log: [] }));
    // The event for an older save of that tab, with the theme changed, comes first.
    const older = JSON.stringify({ generator: GENERATOR, theme: 'dark', test: aTest({ seed, started }), history: [], practice: null, log: [] });
    window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: older, storageArea: localStorage }));
    flushSync();
    expect(saved().test.seed).toBe('new');
    expect(saved().test.answers[0]).toBe(3);
  });

  it('does not bring back a save that was cleared before its event arrived', async () => {
    const { startTest, finishTest, store, flushSync } = await openTab();
    startTest('abc');
    flushSync();
    const { seed, started } = store.test;
    finishTest();
    flushSync();
    localStorage.clear();
    const older = JSON.stringify({ generator: GENERATOR, theme: null, test: aTest({ seed, started }), history: [], practice: null, log: [] });
    window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: older, storageArea: localStorage }));
    flushSync();
    expect(localStorage.getItem('raven')).toBe(null);
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
    // The listener reads storage, so the damaged value has to be what storage holds.
    localStorage.setItem('raven', '{"history":');
    window.dispatchEvent(new StorageEvent('storage', { key: 'raven', newValue: '{"history":', storageArea: localStorage }));
    expect(store.theme).toBe(null);
    otherTabWrites({ generator: GENERATOR - 1, test: aTest(), history: [aResult(10)] });
    expect(store.test).toBe(null);
    expect(store.history.map((h) => h.date)).toEqual([10]);
  });
});

// Each tab here hears of the other's saves only when the test says so, as the browser tells a tab after the fact.
describe('a save merges with what storage holds', () => {
  it('keeps the latest theme when the event for an earlier save arrives after a later one', async () => {
    const tab = await openTab();
    const first = whole({ theme: 'dark' });
    localStorage.setItem('raven', first);
    localStorage.setItem('raven', whole({ theme: 'light' }));
    tab.hear(first);
    expect(tab.store.theme).toBe('light');
    expect(saved().theme).toBe('light');
  });

  it('keeps answers two tabs gave to different questions of the same test', async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const a = await openTab();
    const b = await openTab();
    a.answerTest(2);
    a.flushSync();
    b.store.test.current = 1;
    b.answerTest(4);
    b.flushSync();
    expect(saved().test.answers).toEqual(answers(2, 4));
    a.hear();
    b.hear();
    expect(a.store.test.answers).toEqual(answers(2, 4));
    expect(b.store.test.answers).toEqual(answers(2, 4));
    // The tab that stayed on its question follows the one that moved.
    expect([a.store.test.current, b.store.test.current]).toEqual([1, 1]);
    const reloaded = await openTab();
    expect(reloaded.store.test.answers).toEqual(answers(2, 4));
  });

  it('takes the later answer when two tabs answer the same question, and adds up time spent', async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const a = await openTab();
    const b = await openTab();
    a.answerTest(2);
    a.spendTime(0, 3);
    a.flushSync();
    b.answerTest(5);
    b.spendTime(0, 2);
    b.spendTime(1, 4);
    b.flushSync();
    a.hear();
    for (const view of [a.store.test, b.store.test, saved().test]) {
      expect(view.answers[0]).toBe(5);
      expect(view.times.slice(0, 2)).toEqual([5, 4]);
    }
  });

  it("leaves a newer generator's test and practice alone, and still adds this tab's results and answers", async () => {
    const ahead = { generator: GENERATOR + 1, theme: null, test: aTest({ seed: 'next', made: 'by the newer version' }), history: [aResult(9)], practice: aPractice({ seed: 'theirs' }), log: [anAttempt(1)] };
    localStorage.setItem('raven', JSON.stringify(ahead));
    // This tab still runs the older generator, with a practice of its own under way.
    const old = await openTab();
    old.startPractice();
    old.store.practice.done = 1;
    old.store.practice.right = 1;
    old.flushSync();
    expect(saved()).toEqual(ahead);

    // The newer tab answers a practice puzzle.
    const moved = { ...ahead, practice: aPractice({ seed: 'theirs', done: 4, count: 4 }), log: [anAttempt(2), anAttempt(1)] };
    localStorage.setItem('raven', JSON.stringify(moved));
    old.hear();
    expect(old.store.log.map((a) => a.date)).toEqual([2, 1]);
    expect(old.store.practice.done).toBe(1);
    expect(saved()).toEqual(moved);

    // What this tab adds goes in; the newer test and practice stay as they were.
    old.store.theme = 'dark';
    old.store.log = [anAttempt(3), ...old.store.log];
    old.store.history = [aResult(10), ...old.store.history];
    old.flushSync();
    expect(saved()).toEqual({ ...moved, theme: 'dark', history: [aResult(10), aResult(9)], log: [anAttempt(3), anAttempt(2), anAttempt(1)] });
    old.store.practice.done = 2;
    old.flushSync();
    expect(saved().practice).toEqual(moved.practice);
    expect(saved().history).toHaveLength(2);
  });

  it("keeps this tab's test and practice when a tab on an older generator saves", async () => {
    localStorage.setItem('raven', whole({ test: aTest(), practice: aPractice() }));
    const tab = await openTab();
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR - 1, theme: null, test: aTest({ seed: 'old' }), history: [aResult(9)], practice: aPractice({ seed: 'old' }), log: [] }));
    tab.hear();
    expect(tab.store.practice.seed).toBe('def');
    expect(saved().generator).toBe(GENERATOR);
    expect(saved().test.seed).toBe('abc');
    expect(saved().practice.seed).toBe('def');
    expect(saved().history.map((h) => h.date)).toEqual([9]);
  });

  for (const heardFirst of [true, false]) {
    it(`keeps a cleared practice and test cleared when another tab saves ${heardFirst ? 'after' : 'before'} hearing of it`, async () => {
      localStorage.setItem('raven', whole({ test: aTest(), practice: aPractice() }));
      const a = await openTab();
      const b = await openTab();
      a.clearUnbuildable('practice');
      a.clearUnbuildable('test');
      a.flushSync();
      if (heardFirst) b.hear();
      b.store.theme = 'dark';
      b.flushSync();
      expect(saved().practice).toBe(null);
      expect(saved().test).toBe(null);
      expect(b.store.practice).toBe(null);
      expect(b.store.test).toBe(null);
      a.hear();
      expect(a.store.practice).toBe(null);
      expect(a.store.test).toBe(null);
      expect(saved().theme).toBe('dark');
    });
  }

  it('takes the practice another tab started after clearing the old one', async () => {
    localStorage.setItem('raven', whole({ practice: aPractice() }));
    const a = await openTab();
    const b = await openTab();
    a.clearUnbuildable('practice');
    a.startPractice();
    a.flushSync();
    const seed = a.store.practice.seed;
    // The other tab had answered the old session meanwhile; the cleared one must not come back.
    b.store.practice.done = 4;
    b.store.practice.right = 3;
    b.flushSync();
    expect(b.store.practice.seed).toBe(seed);
    expect(saved().practice.seed).toBe(seed);
    a.hear();
    expect(a.store.practice.seed).toBe(seed);
  });

  it('keeps results that finished in the same millisecond with different seeds', async () => {
    const twin = (seed) => ({ ...aResult(10), seed, total: TEST_LENGTH, answers: Array(TEST_LENGTH).fill(null), generator: GENERATOR });
    const a = await openTab();
    const b = await openTab();
    a.store.history = [twin('one')];
    a.flushSync();
    b.store.history = [twin('two')];
    b.flushSync();
    a.hear();
    for (const history of [a.store.history, b.store.history, saved().history]) expect(history.map((h) => h.seed)).toEqual(['one', 'two']);
    const reloaded = await openTab();
    expect(reloaded.store.history.map((h) => h.seed)).toEqual(['one', 'two']);
    expect(reloaded.pastTest('10', 'one').seed).toBe('one');
    expect(reloaded.pastTest('10', 'two').seed).toBe('two');
    expect(new Set(reloaded.store.history.map(reloaded.resultKey)).size).toBe(2);
    // A link from before results had keys still opens a test.
    expect(reloaded.pastTest('10')).not.toBe(null);
  });

  it("keeps another tab's finish when this tab saves before hearing of it", async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const a = await openTab();
    const b = await openTab();
    a.answerTest(1);
    a.finishTest();
    a.flushSync();
    const finished = a.store.test.finished;
    b.store.theme = 'dark';
    b.flushSync();
    expect(saved().test.finished).toBe(finished);
    expect(saved().history).toHaveLength(1);
    expect(b.store.test.finished).toBe(finished);
    expect(b.store.test.answers[0]).toBe(1);
    expect(b.store.history).toHaveLength(1);
  });

  it('scores a finish with the answers another tab gave since this tab last heard from it', async () => {
    localStorage.setItem('raven', whole({ test: aTest({ started: Date.now() }) }));
    const a = await openTab();
    const b = await openTab();
    a.answerTest(2);
    a.spendTime(0, 3);
    a.flushSync();
    b.store.test.current = 1;
    b.answerTest(4);
    b.finishTest();
    b.flushSync();
    expect(b.store.test.answers).toEqual(answers(2, 4));
    expect(saved().history[0].answers).toEqual(answers(2, 4));
    expect(saved().history[0].times[0]).toBe(3);
    expect(saved().history[0].outcomes.slice(0, 3)).toMatch(/^[rw]{2}-$/);
    a.hear();
    expect(a.store.test.finished).toBe(b.store.test.finished);
    expect(a.store.history).toEqual(b.store.history);
  });

  it('records a test once when a second tab finishes it without having heard of the first finish', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    localStorage.setItem('raven', whole({ test: aTest({ started: Date.now() }) }));
    const a = await openTab();
    const b = await openTab();
    a.finishTest();
    a.flushSync();
    const finished = a.store.test.finished;
    vi.setSystemTime(finished + 60_000);
    b.finishTest();
    b.flushSync();
    expect(b.store.test.finished).toBe(finished);
    expect(b.store.history.map((h) => h.date)).toEqual([finished]);
    expect(saved().history.map((h) => h.date)).toEqual([finished]);
    a.hear();
    expect(a.store.history).toHaveLength(1);
  });

  it('settles on one practice when two tabs each start one, and counts answers given in both', async () => {
    const a = await openTab();
    const b = await openTab();
    a.startPractice();
    a.flushSync();
    b.startPractice();
    b.store.practice.done = 1;
    b.flushSync();
    // The session with more answers stays.
    const seed = b.store.practice.seed;
    expect(saved().practice.seed).toBe(seed);
    a.hear();
    expect(a.store.practice.seed).toBe(seed);
    // Both tabs now answer the same puzzle before hearing of each other.
    a.store.practice.done += 1;
    a.store.practice.right += 1;
    a.store.practice.choice = 2;
    a.flushSync();
    b.store.practice.done += 1;
    b.store.practice.choice = 3;
    b.flushSync();
    a.hear();
    for (const practice of [a.store.practice, b.store.practice, saved().practice]) expect(practice).toMatchObject({ seed, done: 3, right: 1 });
    expect(a.store.practice).toEqual(b.store.practice);
  });

  it('leaves a newer test from another tab in storage while an older one plays on here', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const a = await openTab();
    const b = await openTab();
    a.startTest('first');
    a.flushSync();
    vi.setSystemTime(Date.now() + 1000);
    b.hear();
    b.startTest('second');
    b.answerTest(3);
    b.flushSync();
    // Hiding or closing the first tab saves it.
    a.answerTest(1);
    a.spendTime(0, 5);
    a.flushSync();
    expect(saved().test.seed).toBe('second');
    expect(saved().test.answers[0]).toBe(3);
    expect(a.store.test.seed).toBe('first');
    expect(a.store.test.answers[0]).toBe(1);
    a.hear();
    expect(a.store.test.seed).toBe('first');
    // Its result still counts, and its results stay on screen.
    a.finishTest();
    a.flushSync();
    expect(a.store.test.seed).toBe('first');
    expect(saved().test.seed).toBe('second');
    expect(saved().test.finished).toBe(null);
    expect(saved().history.map((h) => h.seed)).toEqual(['first']);
    b.hear();
    expect(b.store.test.seed).toBe('second');
    expect(b.store.history.map((h) => h.seed)).toEqual(['first']);
  });

  it('saves a test started after the clock was set back', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const tab = await openTab();
    tab.startTest('first');
    tab.finishTest();
    tab.flushSync();
    vi.setSystemTime(Date.now() - 3_600_000);
    tab.startTest('second');
    tab.answerTest(2);
    tab.flushSync();
    expect(saved().test.seed).toBe('second');
    expect(saved().test.answers[0]).toBe(2);
  });

  it('keeps the newer test in storage when the tab playing an older one clears its own', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const a = await openTab();
    const b = await openTab();
    a.startTest('first');
    a.flushSync();
    vi.setSystemTime(Date.now() + 1000);
    b.hear();
    b.startTest('second');
    b.flushSync();
    a.hear();
    expect(a.store.test.seed).toBe('first');
    a.clearUnbuildable('test');
    a.flushSync();
    expect(saved().test.seed).toBe('second');
    expect(a.store.test.seed).toBe('second');
  });

  it('settles after both tabs have heard each other, with nothing left to write', async () => {
    localStorage.setItem('raven', whole({ test: aTest(), history: [aResult(9)], log: [anAttempt(1)] }));
    const a = await openTab();
    const b = await openTab();
    a.answerTest(2);
    a.store.log = [anAttempt(3), ...a.store.log];
    a.flushSync();
    b.store.history = [aResult(11), ...b.store.history];
    b.store.theme = 'light';
    b.flushSync();
    a.hear();
    b.hear();
    const settled = localStorage.getItem('raven');
    const write = vi.spyOn(localStorage, 'setItem');
    a.hear();
    b.hear();
    a.flushSync();
    b.flushSync();
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem('raven')).toBe(settled);
    expect(saved()).toMatchObject({ theme: 'light', log: [anAttempt(3), anAttempt(1)] });
    expect(saved().history.map((h) => h.date)).toEqual([11, 9]);
  });

  it("keeps this tab's changes for the next save when a write fails", async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const tab = await openTab();
    const real = localStorage;
    let blocked = true;
    vi.stubGlobal('localStorage', {
      getItem: (key) => real.getItem(key),
      setItem(key, value) {
        if (blocked) throw new DOMException('full', 'QuotaExceededError');
        real.setItem(key, value);
      },
    });
    tab.answerTest(2);
    tab.flushSync();
    tab.store.test.current = 1;
    tab.flushSync();
    expect(tab.store.test.answers[0]).toBe(2);
    blocked = false;
    tab.store.theme = 'dark';
    tab.flushSync();
    expect(JSON.parse(real.getItem('raven')).test.answers[0]).toBe(2);
  });

  it('brings back an answer that a save from another tab missed', async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const tab = await openTab();
    tab.answerTest(2);
    tab.flushSync();
    // The other tab read storage just before that save and wrote just after it, with its own answer to the next question.
    localStorage.setItem('raven', whole({ test: aTest({ answers: answers(null, 4) }) }));
    tab.hear();
    expect(tab.store.test.answers.slice(0, 2)).toEqual([2, 4]);
    expect(saved().test.answers.slice(0, 2)).toEqual([2, 4]);
  });

  it('keeps a test another tab started after the clock was set back, while the older one plays on here', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const a = await openTab();
    const b = await openTab();
    a.startTest('first');
    a.flushSync();
    b.hear();
    vi.setSystemTime(Date.now() - 3_600_000);
    a.startTest('second');
    a.flushSync();
    b.hear();
    expect(saved().test.seed).toBe('second');
    b.answerTest(1);
    b.flushSync();
    expect(b.store.test.seed).toBe('first');
    expect(saved().test.seed).toBe('second');
  });

  it('leaves a test another tab finished and replaced, instead of finishing it again', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const a = await openTab();
    const b = await openTab();
    a.startTest('first');
    a.flushSync();
    b.hear();
    expect(b.store.test.seed).toBe('first');
    vi.setSystemTime(Date.now() + 1000);
    a.finishTest();
    a.flushSync();
    vi.setSystemTime(Date.now() + 1000);
    a.startTest('second');
    a.flushSync();
    // This tab has heard of neither when its player ends the first test.
    expect(b.finishTest()).toBe(false);
    b.flushSync();
    expect(b.store.test.seed).toBe('second');
    expect(saved().test).toMatchObject({ seed: 'second', finished: null });
    expect(saved().history.map((h) => h.seed)).toEqual(['first']);
  });

  it('writes nothing after an event when storage cannot be read', async () => {
    localStorage.setItem('raven', whole({ test: aTest() }));
    const tab = await openTab();
    const earlier = localStorage.getItem('raven');
    // Another tab has answered since the save this event is for.
    const latest = whole({ test: aTest({ answers: answers(3) }) });
    localStorage.setItem('raven', latest);
    const real = localStorage;
    vi.stubGlobal('localStorage', {
      getItem() {
        throw new DOMException('denied', 'SecurityError');
      },
      setItem: (key, value) => real.setItem(key, value),
    });
    tab.store.theme = 'dark';
    tab.hear(earlier);
    expect(real.getItem('raven')).toBe(latest);
  });

  it('does not put back a result or answer that a newer generator dropped', async () => {
    const ahead = { generator: GENERATOR + 1, theme: null, test: null, history: [aResult(10), aResult(9)], practice: null, log: [anAttempt(2), anAttempt(1)] };
    localStorage.setItem('raven', JSON.stringify(ahead));
    const old = await openTab();
    localStorage.setItem('raven', JSON.stringify({ ...ahead, history: [aResult(10)], log: [anAttempt(2)] }));
    old.hear();
    old.store.history = [aResult(11), ...old.store.history];
    old.flushSync();
    expect(saved().history.map((h) => h.date)).toEqual([11, 10]);
    expect(saved().log.map((a) => a.date)).toEqual([2]);
  });
});
