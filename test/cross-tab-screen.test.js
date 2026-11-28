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

const reviewable = (seed, started, date) => ({ ...resultOf(seed, started, date), answers: Array(TEST_LENGTH).fill(null), generator: GENERATOR });
const goTo = (hash) => {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  svelte.flushSync();
};

it('opens the saved results of an older test of yours when Back reaches its entry after another tab started a new test', async () => {
  const finished = { ...aTest(), started: 1000, finished: 5000 };
  await open('#/test/abc', { test: finished, history: [reviewable('abc', 1000, 5000)] });
  otherTabUpdates({ test: { ...aTest(), seed: 'def', started: 9000 } });
  goTo('#/test/abc');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.querySelector('[aria-label="Past tests"]')).not.toBe(null);
  expect(document.querySelector('.score')).not.toBe(null);
});

it('opens the saved results of an older test of yours after you started another one in this tab', async () => {
  await open('#/test/abc', { history: [reviewable('abc', 1000, 5000)] });
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.querySelector('.score')).not.toBe(null);
  state.startTest('def');
  svelte.flushSync();
  expect(document.querySelector('[aria-label="Option A"]')).not.toBe(null);
  goTo('#/test/abc');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.querySelector('.score')).not.toBe(null);
});

it('goes home, without a shared-test invitation, for an older test of yours that cannot be reviewed', async () => {
  await open('#/test/abc', { history: [{ ...resultOf('abc', 1000, 5000), generator: GENERATOR }] });
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.querySelector('.score')).toBe(null);
  expect(document.body.textContent).toContain('Take the test');
});

it('still shows the shared-test invitation for a seed that is not in your history', async () => {
  await open('#/test/xyz', { history: [reviewable('abc', 1000, 5000)] });
  expect(document.body.textContent).toContain('Someone shared test');
});

it('still shows the shared-test invitation for a seed you took with an older generator, which built a different test', async () => {
  await open('#/test/abc', { history: [{ ...reviewable('abc', 1000, 5000), generator: GENERATOR - 1 }, resultOf('abc', 500, 800)] });
  expect(document.body.textContent).toContain('Someone shared test');
});

const tapButton = (name) => {
  [...document.querySelectorAll('button')].find((b) => b.textContent.includes(name)).click();
  svelte.flushSync();
};

it('calls a test of yours replaced before you finished it your own when Back reaches its entry, and starts it again', async () => {
  await open('#/');
  state.startTest('abc');
  svelte.flushSync();
  document.querySelector('[aria-label="Option A"]').click();
  svelte.flushSync();
  state.startTest('def');
  svelte.flushSync();
  goTo('#/test/abc');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.body.textContent).toContain('You didn’t finish test abc');
  // Starting it again replaces the test now running, so that takes a second tap.
  tapButton('Start it again');
  expect(state.store.test.seed).toBe('def');
  tapButton('Tap again to replace your test');
  expect(state.store.test.seed).toBe('abc');
  expect(state.store.test.answers.every((a) => a === null)).toBe(true);
});

it('calls your own test replaced by another tab your own after this tab reloads', async () => {
  await open('#/');
  state.startTest('abc');
  svelte.flushSync();
  otherTabUpdates({ test: { ...aTest(), seed: 'def', started: Date.now() + 1000 }, begun: [{ seed: 'def', date: Date.now() + 1000, generator: GENERATOR }] });
  // The test plays on here until the tab reloads, and storage holds the other tab's.
  expect(state.store.test.seed).toBe('abc');
  const saved = JSON.parse(localStorage.getItem('raven'));
  expect(saved.test.seed).toBe('def');
  svelte.unmount(app);
  for (const listener of listeners.splice(0)) window.removeEventListener('storage', listener);
  document.body.innerHTML = '';
  await open('#/test/abc', saved);
  expect(state.store.test.seed).toBe('def');
  expect(document.body.textContent).not.toContain('Someone shared test');
  expect(document.body.textContent).toContain('You didn’t finish test abc');
  // The test running now is a tap away.
  tapButton('Resume your test');
  expect(location.hash).toBe('#/test/def');
  expect(document.querySelector('[aria-label="Option A"]')).not.toBe(null);
});

it('still shows the shared-test invitation for a seed you started with an older generator, which builds a different test', async () => {
  await open('#/test/abc', { begun: [{ seed: 'abc', date: 1000, generator: GENERATOR - 1 }] });
  expect(document.body.textContent).toContain('Someone shared test');
});

it('asks again on Home when another tab finished the warned test and started a new one before the second tap', async () => {
  const test = aTest();
  await open('#/', { test });
  tapButton('Start a new test');
  expect(document.body.textContent).toContain('Tap again to start over');
  const ghi = { ...aTest(), seed: 'ghi', started: Date.now() + 1000 };
  otherTabUpdates({ test: ghi, history: [resultOf('abc', test.started, Date.now() + 500)] });
  expect(state.store.test.seed).toBe('ghi');
  expect(document.body.textContent).not.toContain('Tap again');
  tapButton('Start a new test');
  expect(state.store.test).toEqual(ghi);
  expect(document.body.textContent).toContain('Tap again to start over');
});

it('asks again before Start it again replaces a newer test another tab started after the first tap', async () => {
  const test = aTest();
  await open('#/test/def', { test, begun: [{ seed: 'def', date: 500, generator: GENERATOR }] });
  tapButton('Start it again');
  expect(document.body.textContent).toContain('Tap again to replace your test');
  const ghi = { ...aTest(), seed: 'ghi', started: Date.now() + 1000 };
  otherTabUpdates({ test: ghi, history: [resultOf('abc', test.started, Date.now() + 500)] });
  expect(state.store.test.seed).toBe('ghi');
  expect(document.body.textContent).not.toContain('Tap again');
  tapButton('Start it again');
  expect(state.store.test).toEqual(ghi);
  expect(document.body.textContent).toContain('Tap again to replace your test');
});

it('asks again on Home when another tab started a new test after the first tap while this tab plays on the old one', async () => {
  const test = aTest();
  await open('#/', { test });
  tapButton('Start a new test');
  const ghi = { ...aTest(), seed: 'ghi', started: Date.now() + 1000 };
  otherTabUpdates({ test: ghi });
  // The old test plays on here, as #71 keeps it, and storage holds the new one.
  expect(state.store.test.seed).toBe('abc');
  expect(document.body.textContent).not.toContain('Tap again');
  tapButton('Start a new test');
  expect(JSON.parse(localStorage.getItem('raven')).test).toEqual(ghi);
  expect(document.body.textContent).toContain('Tap again to start over');
});

it('asks again on Home when another tab saved a new test that this tab has not heard about yet', async () => {
  const test = aTest();
  await open('#/', { test });
  tapButton('Start a new test');
  const ghi = { ...aTest(), seed: 'ghi', started: Date.now() + 1000 };
  // Saved, with the storage event still on its way.
  localStorage.setItem('raven', JSON.stringify({ ...JSON.parse(localStorage.getItem('raven')), test: ghi }));
  tapButton('Tap again to start over');
  expect(JSON.parse(localStorage.getItem('raven')).test).toEqual(ghi);
  expect(document.body.textContent).toContain('Tap again to start over');
  tapButton('Tap again to start over');
  expect(state.store.test.seed).not.toBe('ghi');
  expect(JSON.parse(localStorage.getItem('raven')).test.seed).toBe(state.store.test.seed);
});
