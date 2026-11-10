/**
 * App state, saved in localStorage. Puzzles themselves are never saved:
 * a seed always rebuilds the same ones.
 */

import { EASIEST, GENERATOR, GROUPS, HARDEST, TEST_LENGTH, generatePuzzle, generateTest } from './engine/generate.js';
import { isSeed, randomSeed } from './engine/rng.js';
import { go } from './router.svelte.js';
import { flushSync } from 'svelte';
import { prefersReducedMotion } from 'svelte/motion';
import { MediaQuery } from 'svelte/reactivity';

const KEY = 'raven';
export const TEST_MINUTES = 25;
/** How many practice answers the statistics keep. */
export const LOG_LENGTH = 500;
/** How many finished tests to keep. Each is a few hundred bytes. */
export const HISTORY_LENGTH = 100;
/** Practice has no clock, so a puzzle left open for longer than this counts as this long. */
export const PRACTICE_MAX_SECONDS = 600;

const blank = () => ({ generator: GENERATOR, theme: null, test: null, history: [], practice: null, log: [] });

/** The last moment the date formatter shows (the end of year 9999); a saved date must fall between 0 and this. */
const MAX_DATE = 253402300799999;
/** Far beyond what anyone answers in practice, so a counter above it is not from this app. */
const MAX_COUNT = 1_000_000;
const isDate = (t) => Number.isFinite(t) && t >= 0 && t <= MAX_DATE;
const isCount = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_COUNT;
const isTarget = (t) => Number.isFinite(t) && t >= EASIEST && t <= HARDEST;
const OPTIONS = 6;
const isChoice = (k) => k === null || (Number.isInteger(k) && k >= 0 && k < OPTIONS);
const areNumbers = (...xs) => xs.every(Number.isFinite);
const isTimes = (times, n) => Array.isArray(times) && times.length === n && times.every((t) => Number.isFinite(t) && t >= 0);
const isKinds = (kinds, n) => Array.isArray(kinds) && kinds.length === n && kinds.every((k) => typeof k === 'string' && k.length <= 120);
const isOutcomes = (o, n) => typeof o === 'string' && o.length === n && /^[rw-]*$/.test(o);

const isTest = (t) =>
  isSeed(t?.seed) &&
  Array.isArray(t.answers) &&
  t.answers.length === TEST_LENGTH &&
  t.answers.every(isChoice) &&
  Number.isInteger(t.current) &&
  t.current >= 0 &&
  t.current < TEST_LENGTH &&
  isDate(t.started) &&
  isDate(t.deadline) &&
  (t.times === undefined || isTimes(t.times, TEST_LENGTH)) &&
  (t.finished === null || isDate(t.finished));

// Older saves have only the score; newer ones keep the answers and the generator that built the puzzles, so the test can be reviewed again.
const isResult = (h) =>
  isSeed(h?.seed) &&
  Number.isInteger(h.total) &&
  h.total > 0 &&
  Number.isInteger(h.score) &&
  h.score >= 0 &&
  h.score <= h.total &&
  areNumbers(h.seconds) &&
  isDate(h.date) &&
  (h.answers === undefined || (Array.isArray(h.answers) && h.answers.length === h.total && h.answers.every(isChoice))) &&
  (h.generator === undefined || Number.isInteger(h.generator)) &&
  (h.timedOut === undefined || typeof h.timedOut === 'boolean') &&
  (h.times === undefined || isTimes(h.times, h.total)) &&
  (h.kinds === undefined || isKinds(h.kinds, h.total)) &&
  (h.outcomes === undefined || isOutcomes(h.outcomes, h.total));

/** One answered practice puzzle, for the statistics. */
const isAttempt = (a) => isKinds([a?.kind], 1) && typeof a.right === 'boolean' && areNumbers(a.seconds) && a.seconds >= 0 && a.seconds <= PRACTICE_MAX_SECONDS && isTarget(a.target) && isDate(a.date);

const isPractice = (p) =>
  isSeed(p?.seed) &&
  [p.count, p.right, p.done].every(isCount) &&
  p.right <= p.done &&
  isTarget(p.target) &&
  isChoice(p.choice) &&
  (p.group === null || GROUPS.includes(p.group));

/** The state in a saved value, keeping only the parts that match what the screens expect. */
function parse(raw) {
  const saved = JSON.parse(raw);
  const state = blank();
  // A save that doesn't match what the screens expect would break them on every visit, so keep only the parts that do.
  if (saved?.theme === 'light' || saved?.theme === 'dark') state.theme = saved.theme;
  // Screens and links find a past test by its date, so dates must be unique.
  if (Array.isArray(saved?.history) && saved.history.every(isResult) && new Set(saved.history.map((h) => h.date)).size === saved.history.length) {
    state.history = saved.history.slice(0, HISTORY_LENGTH);
  }
  if (Array.isArray(saved?.log) && saved.log.every(isAttempt)) state.log = saved.log.slice(0, LOG_LENGTH);
  // Another generator builds different puzzles from the same seeds, so work in progress can't carry over.
  if (saved?.generator === GENERATOR) {
    // Tests started before times were kept count from zero.
    if (isTest(saved.test)) state.test = { ...saved.test, times: saved.test.times ?? Array(TEST_LENGTH).fill(0) };
    if (isPractice(saved.practice)) state.practice = saved.practice;
  }
  return state;
}

function load() {
  try {
    return parse(localStorage.getItem(KEY));
  } catch {
    // Unreadable or blocked storage: start over rather than fail to open.
    return blank();
  }
}

export const store = $state(load());

$effect.root(() => {
  $effect(() => {
    const saved = JSON.stringify(store);
    try {
      localStorage.setItem(KEY, saved);
    } catch {
      // Private browsing can block storage; the app still works for this visit.
    }
  });
});

/** Both lists, newest first, with each entry once. Entries of `keep` win when two share a key. */
function union(keep, other, keyOf, limit) {
  const seen = new Set(keep.map(keyOf));
  return [...keep, ...other.filter((x) => !seen.has(keyOf(x)))].sort((a, b) => b.date - a.date).slice(0, limit);
}

/** Take in what another tab saved, so this tab's next save doesn't erase it. */
function takeFromOtherTab(raw) {
  let other;
  try {
    other = parse(raw);
  } catch {
    return;
  }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const history = union(store.history, other.history, (h) => h.date, HISTORY_LENGTH);
  if (!same(history, store.history)) store.history = history;
  const log = union(store.log, other.log, (a) => JSON.stringify(a), LOG_LENGTH);
  if (!same(log, store.log)) store.log = log;
  if (other.theme && other.theme !== store.theme) store.theme = other.theme;
  // Work in progress here stays, unless it is the same test or practice the other tab moved on.
  const mine = store.test;
  const theirs = other.test;
  if (theirs && !same(mine, theirs) && (!isRunning(mine) || (mine.seed === theirs.seed && mine.started === theirs.started && !(mine.finished && !theirs.finished)))) store.test = theirs;
  if (other.practice && !same(store.practice, other.practice) && (!store.practice || store.practice.seed === other.practice.seed)) store.practice = other.practice;
}

addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && event.key === KEY && event.newValue) takeFromOtherTab(event.newValue);
});

const prefersLight = new MediaQuery('(prefers-color-scheme: light)', false);

/** The theme on screen: your choice, or the system's. */
export const currentTheme = () => store.theme ?? (prefersLight.current ? 'light' : 'dark');

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  // The view transition snapshots the page once this returns, so the new theme must already be on screen.
  const apply = () => flushSync(() => (store.theme = next));
  if (document.startViewTransition && !prefersReducedMotion.current) document.startViewTransition(apply);
  else apply();
}

const tests = new Map();

/** A test's puzzles, keeping the last few built in memory. */
export function puzzlesFor(seed) {
  const puzzles = tests.get(seed) ?? generateTest(seed);
  tests.delete(seed);
  tests.set(seed, puzzles);
  if (tests.size > 3) tests.delete(tests.keys().next().value);
  return puzzles;
}

let upcoming = randomSeed();

/** Build the next new test ahead of time, so starting it is instant. */
export const prepareTest = () => puzzlesFor(upcoming);

export function startTest(seed = upcoming) {
  if (seed === upcoming) upcoming = randomSeed();
  const now = Date.now();
  store.test = {
    seed,
    answers: Array(TEST_LENGTH).fill(null),
    times: Array(TEST_LENGTH).fill(0),
    current: 0,
    started: now,
    deadline: now + TEST_MINUTES * 60_000,
    finished: null,
  };
  go(`test/${seed}`);
}

export const scoreOf = (test) => puzzlesFor(test.seed).filter((p, i) => test.answers[i] === p.answer).length;

export const isRunning = (test) => test && !test.finished;

/** Answer the current puzzle, unless time is up. Returns whether the answer counts. */
export function answerTest(k) {
  const test = store.test;
  if (!isRunning(test) || Date.now() >= test.deadline) return false;
  test.answers[test.current] = k;
  return true;
}

/** Add time spent looking at a puzzle of the running test. */
export function spendTime(i, seconds) {
  const test = store.test;
  if (!isRunning(test)) return;
  // A phone can put the tab to sleep and wake it after the deadline; time past the deadline wasn't spent on the puzzle.
  const spent = seconds - Math.max(0, (Date.now() - test.deadline) / 1000);
  if (spent > 0) test.times[i] = Math.round((test.times[i] + spent) * 10) / 10;
}

/** A short name for a puzzle's style: its family and the rules on its changing attributes, like "tiles:xor". */
export const kindOf = (puzzle) => `${puzzle.family}:${puzzle.rules.map((r) => r.rule).sort().join('+')}`;

export const elapsed = (test) => Math.round((test.finished - test.started) / 1000);

export function finishTest() {
  const test = store.test;
  test.finished = Math.min(Date.now(), test.deadline);
  const puzzles = puzzlesFor(test.seed);
  store.history = [
    {
      seed: test.seed,
      score: scoreOf(test),
      total: test.answers.length,
      seconds: elapsed(test),
      date: test.finished,
      answers: [...test.answers],
      generator: GENERATOR,
      timedOut: test.finished >= test.deadline,
      times: [...test.times],
      kinds: puzzles.map(kindOf),
      outcomes: puzzles.map((p, i) => (test.answers[i] == null ? '-' : test.answers[i] === p.answer ? 'r' : 'w')).join(''),
    },
    ...store.history,
  ].slice(0, HISTORY_LENGTH);
}

/** Whether a past test can be opened again: its answers were kept and the same generator still builds its puzzles. */
export const canReview = (h) => Array.isArray(h.answers) && h.answers.length === TEST_LENGTH && h.generator === GENERATOR;

export const pastTest = (date) => store.history.find((h) => String(h.date) === String(date)) ?? null;

/** A test left open past its deadline ends at the deadline. */
export function expireTest() {
  if (isRunning(store.test) && Date.now() >= store.test.deadline) finishTest();
}

/** Drop the saved work whose seed can't be built: the practice if that's the screen that failed, otherwise the test. The other is kept. */
export function clearUnbuildable(page) {
  if (page === 'practice') store.practice = null;
  else store.test = null;
}

// Practice gets harder after a right answer and easier after a miss.
const STEP_UP = 0.6;
const STEP_DOWN = 0.9;

export function startPractice() {
  store.practice ??= { seed: randomSeed(), count: 0, target: EASIEST, right: 0, done: 0, choice: null, group: null };
}

export const practicePuzzle = (p) => generatePuzzle(`${p.seed}/${p.count}`, p.target, p.group);

/** Levels 1 to 10 for showing the difficulty. */
export const levelOf = (target) => 1 + Math.round(((target - EASIEST) / (HARDEST - EASIEST)) * 9);

export function choosePractice(puzzle, choice, seconds = 0) {
  const p = store.practice;
  p.choice = choice;
  p.done += 1;
  if (choice === puzzle.answer) p.right += 1;
  const attempt = { kind: kindOf(puzzle), right: choice === puzzle.answer, seconds: Math.round(Math.min(seconds, PRACTICE_MAX_SECONDS) * 10) / 10, target: p.target, date: Date.now() };
  store.log = [attempt, ...store.log].slice(0, LOG_LENGTH);
}

export function nextPractice(puzzle) {
  const p = store.practice;
  const step = p.choice === puzzle.answer ? STEP_UP : -STEP_DOWN;
  p.target = Math.min(HARDEST, Math.max(EASIEST, p.target + step));
  p.group = puzzle.group;
  p.count += 1;
  p.choice = null;
}
