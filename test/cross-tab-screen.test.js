// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH } from '../src/lib/engine/generate.js';

let app;
let svelte;
let state;
const listeners = [];
const aTest = () => ({ seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: Date.now(), deadline: Date.now() + 60_000, finished: null });

async function open(hash, saved) {
  vi.resetModules();
  location.hash = hash;
  localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history: [], log: [], ...saved }));
  const add = window.addEventListener.bind(window);
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
