// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';
import { duration } from '../src/lib/format.js';

let app;
let svelte;
let state;
const listeners = [];
const aTest = () => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: Date.now(), deadline: Date.now() + 60_000, finished: null });

// Bound once: a test that opens the app twice would otherwise wrap its own spy.
const add = window.addEventListener.bind(window);

async function open(hash, saved) {
  vi.resetModules();
  location.hash = hash;
  localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history: [], log: [], ...saved }));
  vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'storage') listeners.push(listener);
    return add(type, listener, options);
  });
  svelte = await import('svelte');
  const [{ default: Screens }, loaded] = await Promise.all([
    import('../src/lib/components/Screens.svelte'),
    import('../src/lib/state.svelte.js'),
  ]);
  state = loaded;
  app = svelte.mount(Screens, { target: document.body });
  svelte.flushSync();
}

function otherTabUpdates(update) {
  const saved = JSON.parse(localStorage.getItem('raven'));
  const newValue = JSON.stringify({ ...saved, ...update });
  const oldValue = localStorage.getItem('raven');
  localStorage.setItem('raven', newValue);
  window.dispatchEvent(new StorageEvent('storage', { key: 'raven', oldValue, newValue, storageArea: localStorage }));
  svelte.flushSync();
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    addEventListener() {},
    removeEventListener() {},
  }));
  // Keep external scripts out of component tests.
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
});

afterEach(() => {
  if (app) svelte.unmount(app);
  app = null;
  for (const listener of listeners.splice(0)) window.removeEventListener('storage', listener);
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('records a quiz answer on the puzzle currently shown after another tab moves forward', async () => {
  const test = aTest();
  await open('#/test/abc', { test });
  otherTabUpdates({ test: { ...test, current: 1 } });
  expect(state.store.test.current).toBe(1);
  document.querySelector('[aria-label="Option A"]').click();
  svelte.flushSync();
  expect(state.store.test.answers[1]).toBe(0);
  const displayed = Number(document.querySelector('[aria-label="All puzzles"]').textContent.match(/\d+/)[0]) - 1;
  expect(state.store.test.answers[displayed], 'the visible puzzle must receive the answer').toBe(0);
});

it('reveals a practice answer after another tab advances the same practice session', async () => {
  const practice = { seed: 'def', count: 0, target: 1, right: 0, done: 0, choice: null, group: null };
  await open('#/practice', { practice });
  const original = state.practicePuzzle(state.store.practice);
  otherTabUpdates({ practice: { ...practice, count: 1, target: 1.6, right: 1, done: 1, group: original.group } });
  const current = state.practicePuzzle(state.store.practice);
  document.querySelector('[aria-label="Option A"]').click();
  svelte.flushSync();
  expect(state.store.log[0].right).toBe(current.answer === 0);
  expect(state.store.practice.choice).toBe(0);
  expect(document.querySelector('[aria-label="Option A"]').disabled, 'answering must reveal the practice puzzle').toBe(true);
  const next = [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Next');
  expect(next).toBeDefined();
  next.click();
  svelte.flushSync();
  expect(state.store.practice.count).toBe(2);
  expect(document.querySelector('[aria-label="Option A"]').disabled).toBe(false);
});

it('does not let a queued quiz advance override another tab moving to a different puzzle', async () => {
  vi.useFakeTimers({ toFake: ['Date', 'performance', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  const test = aTest();
  await open('#/test/abc', { test });
  document.querySelector('[aria-label="Option A"]').click();
  otherTabUpdates({ test: { ...test, current: 3 } });
  vi.advanceTimersByTime(300);
  svelte.flushSync();
  expect(state.store.test.current).toBe(3);
  expect(document.querySelector('[aria-label="All puzzles"]').textContent).toContain('4 /');
});

it('records time on the previous puzzle when another tab advances the same test', async () => {
  vi.useFakeTimers({ toFake: ['Date', 'performance', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  const test = aTest();
  await open('#/test/abc', { test });
  vi.advanceTimersByTime(2000);
  otherTabUpdates({ test: { ...test, current: 1 } });
  expect(state.store.test.times[0]).toBe(2);
  expect(state.store.test.times[1]).toBe(0);
  vi.advanceTimersByTime(3000);
  document.querySelector('[aria-label="Next puzzle"]').click();
  svelte.flushSync();
  expect(state.store.test.times[1]).toBe(3);
  vi.advanceTimersByTime(2000);
  document.querySelector('[aria-label="Home (the timer keeps running)"]').click();
  svelte.flushSync();
  expect(state.store.test.times[2]).toBe(2);
});

it('keeps timing cleanup and queued advancement out of a replacement test with the same seed', async () => {
  vi.useFakeTimers({ toFake: ['Date', 'performance', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  const test = aTest();
  await open('#/test/abc', { test });
  vi.advanceTimersByTime(2000);
  document.querySelector('[aria-label="Option A"]').click();
  state.startTest('abc');
  svelte.flushSync();
  expect(state.store.test.times.every((seconds) => seconds === 0)).toBe(true);
  vi.advanceTimersByTime(300);
  svelte.flushSync();
  expect(state.store.test.current).toBe(0);
  expect(state.store.test.answers.every((answer) => answer === null)).toBe(true);
});

it('starts a new practice on the practice screen when another tab clears the session', async () => {
  await open('#/practice', { practice: { seed: 'def', count: 3, target: 2.2, right: 2, done: 3, choice: null, group: null } });
  otherTabUpdates({ practice: null });
  expect(state.store.practice).toMatchObject({ count: 0, done: 0 });
  expect(state.store.practice.seed).not.toBe('def');
  expect(document.querySelector('.score').getAttribute('aria-label')).toBe('0 right out of 0');
  expect(JSON.parse(localStorage.getItem('raven')).practice.seed).toBe(state.store.practice.seed);
});

it('closes the explanation when another tab clears the practice it explains', async () => {
  await open('#/practice', { practice: { seed: 'def', count: 0, target: 1, right: 0, done: 1, choice: 0, group: null } });
  const button = (text) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === text);
  button('Why?').click();
  svelte.flushSync();
  expect(button('Next puzzle')).toBeDefined();
  otherTabUpdates({ practice: null });
  expect(state.store.practice.done).toBe(0);
  expect(button('Next puzzle')).toBeUndefined();
});

it('leaves the test screen for home when another tab clears the test', async () => {
  await open('#/test/abc', { test: aTest() });
  expect(document.querySelector('[aria-label="Option A"]')).not.toBe(null);
  otherTabUpdates({ test: null });
  expect(state.store.test).toBe(null);
  expect(document.querySelector('[aria-label="Option A"]')).toBe(null);
  expect(JSON.parse(localStorage.getItem('raven')).test).toBe(null);
});

it('goes home without a result when Finish is tapped on a test another tab has cleared', async () => {
  await open('#/test/abc', { test: aTest() });
  // The other tab's save has not been heard of yet.
  localStorage.setItem('raven', JSON.stringify({ ...JSON.parse(localStorage.getItem('raven')), test: null }));
  document.querySelector('[aria-label="All puzzles"]').click();
  svelte.flushSync();
  [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Finish anyway').click();
  svelte.flushSync();
  expect(state.store.test).toBe(null);
  expect(state.store.history).toEqual([]);
  expect(location.hash).toBe('#/');
  expect(document.querySelector('[aria-label="Option A"]')).toBe(null);
});

it('opens each of two past tests that ended in the same millisecond', async () => {
  const past = (seed, seconds) => ({ seed, score: 0, total: TEST_LENGTH, seconds, date: 10, answers: Array(TEST_LENGTH).fill(null), generator: GENERATOR });
  const history = [past('one', 61), past('two', 125)];
  for (const h of history) {
    await open(`#/history/10/${h.seed}`, { history });
    expect(document.querySelector('.score').textContent).toContain(duration(h.seconds));
    svelte.unmount(app);
    document.body.innerHTML = '';
  }
  // A link from before results had keys still opens a test with that date.
  await open('#/history/10', { history });
  expect(document.querySelector('.score').textContent).toContain(duration(61));
});

const resultOf = (seed, started, date) => ({ seed, score: 0, total: TEST_LENGTH, seconds: 4, date, started });

it('moves from the results of a finished test to the test another tab starts, not to a shared-test invitation', async () => {
  const finished = { ...aTest(), started: 1000, finished: 5000 };
  await open('#/test/abc', { test: finished, history: [resultOf('abc', 1000, 5000)] });
  expect(document.body.textContent).toContain('Results');
  const entries = history.length;
  otherTabUpdates({ test: { ...aTest(), seed: 'def', started: 9000 } });
  expect(history.length).toBe(entries); // Back doesn't return to the old seed, which would read as shared
  expect(state.store.test.seed).toBe('def');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(location.hash).toBe('#/test/def');
  expect(document.querySelector('[aria-label="Option A"]')).not.toBe(null);
});

it('moves from a test another tab has finished to the test that tab starts next', async () => {
  const running = { ...aTest(), started: 1000 };
  await open('#/test/abc', { test: running });
  otherTabUpdates({ test: { ...aTest(), seed: 'def', started: 9000 }, history: [resultOf('abc', 1000, 5000)] });
  expect(state.store.test.seed).toBe('def');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(location.hash).toBe('#/test/def');
});

it('leaves another page alone when another tab starts a new test', async () => {
  await open('#/history', { test: { ...aTest(), started: 1000, finished: 5000 } });
  otherTabUpdates({ test: { ...aTest(), seed: 'def', started: 9000 } });
  expect(state.store.test.seed).toBe('def');
  expect(location.hash).toBe('#/history');
});
