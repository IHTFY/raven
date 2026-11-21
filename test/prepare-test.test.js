// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GENERATOR, TEST_LENGTH, generateTest } from '../src/lib/engine/generate.js';

let app;
let svelte;
let state;
/** Puzzles built so far: each one starts its own random number generator. */
let built;

async function load() {
  vi.resetModules();
  built = 0;
  vi.doMock('../src/lib/engine/rng.js', async (importActual) => {
    const actual = await importActual();
    return {
      ...actual,
      createRng(seed) {
        built++;
        return actual.createRng(seed);
      },
    };
  });
  state = await import('../src/lib/state.svelte.js');
}

async function open(hash, saved) {
  location.hash = hash;
  localStorage.setItem('raven', JSON.stringify({ generator: GENERATOR, history: [], log: [], ...saved }));
  await load();
  svelte = await import('svelte');
  const { default: Screens } = await import('../src/lib/components/Screens.svelte');
  app = svelte.mount(Screens, { target: document.body });
  svelte.flushSync();
}

const button = (name) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === name);
const tap = (name) => {
  button(name).click();
  svelte.flushSync();
};

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date', 'performance', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
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
  document.body.innerHTML = '';
  vi.doUnmock('../src/lib/engine/rng.js');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('a test is built before the tap that starts it', () => {
  it('builds a shared test while its link’s screen waits, so "Take this test" builds nothing', async () => {
    await open('#/test/shared1');
    vi.advanceTimersByTime(1000);
    expect(built).toBe(TEST_LENGTH);
    tap('Take this test');
    expect(document.querySelector('[role="timer"]')).not.toBeNull();
    expect(state.store.test.seed).toBe('shared1');
    expect(built, 'the tap must not build puzzles').toBe(TEST_LENGTH);
  });

  it('builds the next test while results are on screen, so "New test" builds nothing', async () => {
    const now = Date.now();
    const test = { seed: 'abc', answers: Array(TEST_LENGTH).fill(null), times: Array(TEST_LENGTH).fill(0), current: 0, started: now - 5000, deadline: now + 60_000, finished: now };
    await open('#/test/abc', { test });
    expect(button('New test')).toBeDefined();
    vi.advanceTimersByTime(1000);
    const before = built;
    tap('New test');
    expect(document.querySelector('[role="timer"]')).not.toBeNull();
    expect(state.store.test.seed).not.toBe('abc');
    expect(built, 'the tap must not build puzzles').toBe(before);
  });

  it('builds a puzzle per turn where the browser has no idle callbacks', async () => {
    await load();
    state.prepareTest('abc');
    vi.advanceTimersToNextTimer();
    expect(built).toBe(1);
    vi.advanceTimersToNextTimer();
    expect(built).toBe(2);
  });

  it('builds for as long as the browser says it is idle, then waits for the next idle moment', async () => {
    const queue = [];
    vi.stubGlobal('requestIdleCallback', (step) => queue.push(step));
    await load();
    state.prepareTest('abc');
    let left = 3;
    queue.shift()({ timeRemaining: () => --left });
    expect(built).toBe(3);
    expect(queue).toHaveLength(1);
    queue.shift()({ timeRemaining: () => 1 });
    expect(built).toBe(TEST_LENGTH);
    expect(queue).toHaveLength(0);
  });

  it('finishes a half-built test on a tap, with the same puzzles as a build in one go', async () => {
    await load();
    state.prepareTest('abc');
    for (let i = 0; i < 10; i++) vi.advanceTimersToNextTimer();
    expect(built).toBe(10);
    const puzzles = state.puzzlesFor('abc');
    expect(built).toBe(TEST_LENGTH);
    expect(puzzles).toEqual(generateTest('abc'));
    vi.advanceTimersByTime(1000);
    expect(built, 'nothing is left for the idle steps').toBe(TEST_LENGTH);
  });

  it('stops building when told to', async () => {
    await load();
    const stop = state.prepareTest('abc');
    vi.advanceTimersToNextTimer();
    stop();
    vi.advanceTimersByTime(1000);
    expect(built).toBe(1);
  });

  it('builds a test once when it is prepared again after being built', async () => {
    await load();
    state.puzzlesFor('abc');
    state.prepareTest('abc');
    vi.advanceTimersByTime(1000);
    expect(built).toBe(TEST_LENGTH);
  });
});
