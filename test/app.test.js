// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EASIEST, GENERATOR, HARDEST, TEST_LENGTH } from '../src/lib/engine/generate.js';
import { pressesControl } from '../src/lib/keys.js';

/** A fresh copy of the app state, loaded from whatever is in localStorage. */
async function loadState() {
  vi.resetModules();
  return import('../src/lib/state.svelte.js');
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

const MAX_DATE = 253402300799999; // 9999-12-31, the last year the date formatter shows in four digits
const aTest = (extra = {}) => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: 1000, deadline: 2000, finished: null, ...extra });
const aResult = (extra = {}) => ({ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, ...extra });
const aPractice = (extra = {}) => ({ seed: 'def', count: 3, target: 2.2, right: 2, done: 3, choice: null, group: null, ...extra });
const anAttempt = (extra = {}) => ({ kind: 'tiles:xor', right: true, seconds: 3, target: 2, date: 1, ...extra });

describe('saves', () => {
  const malformed = [
    // Seeds must fit the pattern links use: 1 to 24 letters and digits.
    { generator: GENERATOR, test: aTest({ seed: 'a'.repeat(25) }) },
    { generator: GENERATOR, test: aTest({ seed: 'a/b' }) },
    { generator: GENERATOR, test: aTest({ seed: 'two words' }) },
    { generator: GENERATOR, history: [aResult({ seed: 'x'.repeat(25) })] },
    { generator: GENERATOR, history: [aResult({ seed: '#/test/x' })] },
    { generator: GENERATOR, practice: aPractice({ seed: 'a'.repeat(25) }) },
    { generator: GENERATOR, practice: aPractice({ seed: 'é' }) },
    // Practice: a known family group, a target in the difficulty range, bounded counters.
    { generator: GENERATOR, practice: aPractice({ group: 'bogus' }) },
    { generator: GENERATOR, practice: aPractice({ group: 'constructor' }) },
    { generator: GENERATOR, practice: aPractice({ target: EASIEST - 0.1 }) },
    { generator: GENERATOR, practice: aPractice({ target: HARDEST + 0.1 }) },
    { generator: GENERATOR, practice: aPractice({ target: 1e308 }) },
    { generator: GENERATOR, practice: aPractice({ count: -1 }) },
    { generator: GENERATOR, practice: aPractice({ count: 1e9 }) },
    { generator: GENERATOR, practice: aPractice({ done: -1 }) },
    { generator: GENERATOR, practice: aPractice({ done: 1e9, right: 0 }) },
    { generator: GENERATOR, practice: aPractice({ right: 4, done: 3 }) },
    { generator: GENERATOR, practice: aPractice({ right: -1 }) },
    { generator: GENERATOR, practice: aPractice({ choice: 6 }) },
    // Dates must be ones the formatter can show.
    { generator: GENERATOR, history: [aResult({ date: 1e300 })] },
    { generator: GENERATOR, history: [aResult({ date: 8.64e15 })] },
    { generator: GENERATOR, history: [aResult({ date: -1 })] },
    { generator: GENERATOR, test: aTest({ started: 1e300 }) },
    { generator: GENERATOR, test: aTest({ deadline: -5 }) },
    { generator: GENERATOR, test: aTest({ finished: 1e300 }) },
    { generator: GENERATOR, log: [anAttempt({ date: 1e300 })] },
    { generator: GENERATOR, log: [anAttempt({ target: 99 })] },
    { generator: GENERATOR, log: [anAttempt({ seconds: 1e308 })] },
    { generator: GENERATOR, history: null },
    { generator: GENERATOR, history: [{ seed: 'abc' }] },
    { generator: GENERATOR, test: { seed: 'abc' } },
    { generator: GENERATOR, test: 'abc', practice: [] },
    { generator: GENERATOR, practice: { seed: 'abc', count: '2' } },
    { generator: GENERATOR, theme: 7 },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, answers: [0] }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, answers: [0, 7] }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, generator: '4' }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: -1, total: 2, seconds: 5, date: 9 }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 3, total: 2, seconds: 5, date: 9 }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 0, total: 0, seconds: 5, date: 9 }] },
    {
      generator: GENERATOR,
      history: [
        { seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9 },
        { seed: 'abc', score: 1, total: 2, seconds: 5, date: 9 },
      ],
    },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, times: [1, -1] }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, outcomes: 'rx' }] },
    { generator: GENERATOR, history: [{ seed: 'xyz', score: 1, total: 2, seconds: 5, date: 9, kinds: ['a', 3] }] },
    { generator: GENERATOR, log: [{ kind: 'tiles:xor', right: 'yes', seconds: 3, target: 2, date: 1 }] },
    [],
    42,
  ];

  it.each(malformed)('starts fresh from a malformed save: %j', async (saved) => {
    localStorage.setItem('raven', JSON.stringify(saved));
    const { store } = await loadState();
    expect(store).toEqual({ generator: GENERATOR, theme: null, test: null, history: [], practice: null, log: [] });
  });

  it('keeps a valid save', async () => {
    const saved = {
      generator: GENERATOR,
      theme: 'light',
      test: {
        seed: 'abc',
        answers: [2, ...Array(TEST_LENGTH - 1).fill(null)],
        times: [4.5, ...Array(TEST_LENGTH - 1).fill(0)],
        current: 1,
        started: 1000,
        deadline: 2000,
        finished: null,
      },
      history: [{ seed: 'xyz', score: 20, total: TEST_LENGTH, seconds: 600, date: 5000 }],
      practice: { seed: 'def', count: 3, target: 2.2, right: 2, done: 3, choice: null, group: 'tiles' },
      log: [{ kind: 'tiles:xor', right: true, seconds: 3.2, target: 2.2, date: 4000 }],
    };
    localStorage.setItem('raven', JSON.stringify(saved));
    const { store } = await loadState();
    expect(store).toEqual(saved);
  });

  it('keeps values at the edge of what is allowed', async () => {
    const saved = {
      generator: GENERATOR,
      theme: null,
      test: aTest({ seed: 'AbC123xyz987AbC123xyz98', started: 0, deadline: MAX_DATE, finished: MAX_DATE }),
      history: [aResult({ seed: 'a', date: 0 }), aResult({ seed: 'z'.repeat(24), date: MAX_DATE })],
      practice: aPractice({ seed: 'Q'.repeat(24), group: 'pointer', target: HARDEST, count: 0, right: 0, done: 0 }),
      log: [anAttempt({ target: EASIEST, date: 0 })],
    };
    localStorage.setItem('raven', JSON.stringify(saved));
    const { store } = await loadState();
    expect(store).toEqual(saved);
  });

  it('keeps the newest HISTORY_LENGTH results from a longer saved history', async () => {
    const history = Array.from({ length: 150 }, (_, i) => aResult({ date: 1000 - i }));
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history }));
    const { HISTORY_LENGTH, store } = await loadState();
    expect(store.history).toEqual(history.slice(0, HISTORY_LENGTH));
  });

  it('accepts the seeds the app makes itself', async () => {
    const { isSeed, randomSeed } = await import('../src/lib/engine/rng.js');
    for (let i = 0; i < 500; i++) expect(isSeed(randomSeed())).toBe(true);
  });

  it('keeps history and theme but drops work in progress from another generator', async () => {
    const history = [{ seed: 'xyz', score: 20, total: TEST_LENGTH, seconds: 600, date: 5000 }];
    const practice = { seed: 'def', count: 3, target: 2.2, right: 2, done: 3, choice: null, group: null };
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR - 1, theme: 'dark', history, practice }));
    const { store } = await loadState();
    expect(store).toEqual({ generator: GENERATOR, theme: 'dark', test: null, history, practice: null, log: [] });
  });
});

describe('past tests', () => {
  it('keeps the answers and generator of a finished test, so it can be reviewed', async () => {
    const { answerTest, canReview, finishTest, pastTest, startTest, store } = await loadState();
    startTest('abc');
    answerTest(2);
    finishTest();
    const [h] = store.history;
    expect(h).toMatchObject({ seed: 'abc', total: TEST_LENGTH, generator: GENERATOR, timedOut: false });
    expect(h.answers).toEqual([2, ...Array(TEST_LENGTH - 1).fill(null)]);
    expect(canReview(h)).toBe(true);
    expect(pastTest(String(h.date))).toBe(h);
    expect(pastTest('123')).toBe(null);
  });

  it('keeps old score-only results, and results from another generator, without reopening them', async () => {
    const history = [
      { seed: 'old', score: 20, total: TEST_LENGTH, seconds: 600, date: 5000 },
      { seed: 'gen', score: 1, total: 2, seconds: 5, date: 6000, answers: [0, null], generator: GENERATOR - 1 },
    ];
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history }));
    const { canReview, store } = await loadState();
    expect(store.history).toEqual(history);
    expect(store.history.map(canReview)).toEqual([false, false]);
  });

  it('doesn’t reopen a result whose answers aren’t a whole test', async () => {
    const history = [{ seed: 'short', score: 1, total: 2, seconds: 5, date: 6000, answers: [0, null], generator: GENERATOR }];
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history }));
    const { canReview, store } = await loadState();
    expect(store.history).toEqual(history);
    expect(canReview(store.history[0])).toBe(false);
  });

  it('keeps up to HISTORY_LENGTH tests', async () => {
    const { HISTORY_LENGTH, finishTest, startTest, store } = await loadState();
    for (let i = 0; i < HISTORY_LENGTH + 2; i++) {
      startTest('abc');
      finishTest();
    }
    expect(store.history).toHaveLength(HISTORY_LENGTH);
  });
});

describe('statistics records', () => {
  it('gives a test saved before times were kept zero times', async () => {
    const test = { seed: 'abc', answers: Array(TEST_LENGTH).fill(null), current: 0, started: 1, deadline: 2, finished: null };
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, test }));
    const { store } = await loadState();
    expect(store.test.times).toEqual(Array(TEST_LENGTH).fill(0));
  });

  it('adds up time per puzzle while the test runs, and saves times, styles, and outcomes', async () => {
    const { answerTest, finishTest, puzzlesFor, spendTime, startTest, store } = await loadState();
    startTest('abc');
    spendTime(0, 2.25);
    spendTime(0, 1);
    spendTime(3, 4);
    answerTest(puzzlesFor('abc')[0].answer);
    finishTest();
    spendTime(1, 5);
    const [h] = store.history;
    expect(h.times.slice(0, 4)).toEqual([3.3, 0, 0, 4]);
    expect(h.outcomes).toBe('r' + '-'.repeat(TEST_LENGTH - 1));
    expect(h.kinds[0]).toMatch(/^[a-z]+:[a-zA-Z+]+$/);
  });

  it('doesn’t count time past the deadline, as when a sleeping tab wakes up late', async () => {
    vi.useFakeTimers();
    const { spendTime, startTest, store } = await loadState();
    startTest('abc');
    vi.setSystemTime(store.test.deadline + 3600 * 1000);
    spendTime(0, 3600 + 30);
    expect(store.test.times[0]).toBe(30);
  });

  it('keeps at most LOG_LENGTH practice answers from a save', async () => {
    const log = Array(600).fill({ kind: 'tiles:xor', right: true, seconds: 3, target: 2, date: 1 });
    localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, log }));
    const { LOG_LENGTH, store } = await loadState();
    expect(store.log).toHaveLength(LOG_LENGTH);
  });

  it('caps the time on a practice puzzle left open', async () => {
    const { PRACTICE_MAX_SECONDS, choosePractice, practicePuzzle, startPractice, store } = await loadState();
    startPractice();
    const puzzle = practicePuzzle(store.practice);
    choosePractice(puzzle, puzzle.answer, 80000);
    expect(store.log[0].seconds).toBe(PRACTICE_MAX_SECONDS);
  });

  it('logs practice answers with their time', async () => {
    const { choosePractice, practicePuzzle, startPractice, store } = await loadState();
    startPractice();
    const puzzle = practicePuzzle(store.practice);
    choosePractice(puzzle, puzzle.answer, 6.04);
    expect(store.log).toHaveLength(1);
    expect(store.log[0]).toMatchObject({ right: true, seconds: 6, kind: expect.stringContaining(`${puzzle.family}:`) });
  });
});

describe('test answers', () => {
  it('records an answer before the deadline', async () => {
    const { answerTest, startTest, store } = await loadState();
    startTest('abc');
    expect(answerTest(3)).toBe(true);
    expect(store.test.answers[0]).toBe(3);
  });

  it('ignores an answer after the deadline, before the timer ends the test', async () => {
    vi.useFakeTimers();
    const { answerTest, startTest, store } = await loadState();
    startTest('abc');
    vi.setSystemTime(store.test.deadline);
    expect(answerTest(3)).toBe(false);
    expect(store.test.answers.every((a) => a == null)).toBe(true);
  });

  it('ignores an answer once the test is finished', async () => {
    const { answerTest, finishTest, startTest, store } = await loadState();
    startTest('abc');
    finishTest();
    expect(answerTest(3)).toBe(false);
    expect(store.test.answers[0]).toBe(null);
  });
});

describe('keyboard shortcuts', () => {
  const key = (key, target) => ({ key, target });

  it('leaves Enter to a focused button or link', () => {
    document.body.innerHTML = '<button id="why">Why?</button><a id="home" href="#/">Home</a><button id="icon"><span id="inner">x</span></button>';
    for (const id of ['why', 'home', 'inner']) expect(pressesControl(key('Enter', document.getElementById(id)))).toBe(true);
  });

  it('keeps Enter as a shortcut on the page and on disabled options', () => {
    document.body.innerHTML = '<button id="option" disabled>A</button>';
    expect(pressesControl(key('Enter', document.body))).toBe(false);
    expect(pressesControl(key('Enter', document.getElementById('option')))).toBe(false);
  });

  it('keeps other keys as shortcuts on a focused button', () => {
    document.body.innerHTML = '<button id="option">A</button>';
    const option = document.getElementById('option');
    expect(pressesControl(key('1', option))).toBe(false);
    expect(pressesControl(key('ArrowRight', option))).toBe(false);
  });
});
