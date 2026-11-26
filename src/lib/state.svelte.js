/**
 * App state, saved in localStorage. Puzzles themselves are never saved:
 * a seed always rebuilds the same ones.
 */

import { EASIEST, GENERATOR, GROUPS, HARDEST, TEST_LENGTH, generatePuzzle, testBuilder } from './engine/generate.js';
import { isSeed, randomSeed } from './engine/rng.js';
import { go, route } from './router.svelte.js';
import { flushSync, untrack } from 'svelte';
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

const blank = () => ({ generator: GENERATOR, theme: null, test: null, history: [], practice: null, log: [], begun: [] });

/** The last moment the date formatter shows (the end of year 9999); a saved date must fall between 0 and this. */
const MAX_DATE = 253402300799999;
/** Far beyond what anyone answers in practice, so a counter above it is not from this app. */
const MAX_COUNT = 1_000_000;
/** Far longer than a test lasts. A saved time above it was edited by hand, and two of them could add up to infinity. */
const MAX_SECONDS = 24 * 60 * 60;
const isDate = (t) => Number.isFinite(t) && t >= 0 && t <= MAX_DATE;
const isCount = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_COUNT;
const isTarget = (t) => Number.isFinite(t) && t >= EASIEST && t <= HARDEST;
const OPTIONS = 6;
const isChoice = (k) => k === null || (Number.isInteger(k) && k >= 0 && k < OPTIONS);
const areNumbers = (...xs) => xs.every(Number.isFinite);
const isTimes = (times, n) => Array.isArray(times) && times.length === n && times.every((t) => Number.isFinite(t) && t >= 0 && t <= MAX_SECONDS);
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
  t.started <= t.deadline &&
  (t.times === undefined || isTimes(t.times, TEST_LENGTH)) &&
  (t.finished === null || isDate(t.finished));

// Older saves have only the score; newer ones keep the answers and the generator that built the puzzles, so the test can be reviewed again,
// and when the test started, which tells another tab still in that test that it is over.
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
  (h.started === undefined || isDate(h.started)) &&
  (h.timedOut === undefined || typeof h.timedOut === 'boolean') &&
  (h.times === undefined || isTimes(h.times, h.total)) &&
  (h.kinds === undefined || isKinds(h.kinds, h.total)) &&
  (h.outcomes === undefined || isOutcomes(h.outcomes, h.total));

/**
 * A test this player started, kept after it is replaced, so its link reads as their own rather than as one someone shared.
 * The generator is kept because another generator builds a different test from the same seed.
 */
const isBegun = (b) => isSeed(b?.seed) && isDate(b.date) && Number.isInteger(b.generator);
const begunKey = (b) => `${b.generator}/${b.seed}`;

/** What tells one past test from another, in the history and in links. Two tests can end in the same millisecond, so the date alone doesn't. */
export const resultKey = (h) => `${h.date}/${h.seed}`;

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
function parse(saved) {
  const state = blank();
  // A save that doesn't match what the screens expect would break them on every visit, so keep only the parts that do.
  if (saved?.theme === 'light' || saved?.theme === 'dark') state.theme = saved.theme;
  // One bad record drops only itself. Screens and links find a past test by its key, so only the first result with a key stays.
  if (Array.isArray(saved?.history)) {
    const keys = new Set();
    state.history = saved.history
      .filter((h) => {
        if (!isResult(h) || keys.has(resultKey(h))) return false;
        keys.add(resultKey(h));
        return true;
      })
      .slice(0, HISTORY_LENGTH)
      .map((h) => ({ ...h, seconds: Math.min(Math.max(h.seconds, 0), MAX_SECONDS) }));
  }
  if (Array.isArray(saved?.log)) state.log = saved.log.filter(isAttempt).slice(0, LOG_LENGTH);
  if (Array.isArray(saved?.begun)) state.begun = saved.begun.filter(isBegun).slice(0, HISTORY_LENGTH);
  // Another generator builds different puzzles from the same seeds, so work in progress can't carry over.
  if (saved?.generator === GENERATOR) {
    // Tests started before times were kept count from zero.
    if (isTest(saved.test)) state.test = { ...saved.test, times: saved.test.times ?? Array(TEST_LENGTH).fill(0) };
    if (isPractice(saved.practice)) state.practice = saved.practice;
  }
  return state;
}

/** False when reading the save failed, so a save may still be there: writing then would replace it with this visit's blank state. */
let canSave = true;

// Every tab saves the whole state under one key, so a save first merges with what storage holds at that moment.
/** The parts of a save that one tab can change under another: results and practice answers are only ever added. */
const held = (state) => structuredClone({ theme: state.theme, test: state.test, practice: state.practice });
/** Storage as this tab last read or wrote it. Whatever differs from it here is this tab's own change; whatever differs from it in storage is another tab's. */
let base = held(blank());
let baseRaw = null;
/** A test this tab plays on, or still shows the results of, while storage holds a newer one from another tab. */
let aside = null;
/** The save in storage when a newer generator wrote it. This tab then only adds its results, practice answers and theme to it. */
let newer = null;
/** Records a newer generator's save has held, here or in storage. This tab adds only the ones it never has, so a record that generator drops stays dropped. */
const known = new Set();

const fromNewer = (saved) => Number.isInteger(saved?.generator) && saved.generator > GENERATOR;

function load() {
  let raw;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Blocked storage: start over for this visit rather than fail to open.
    canSave = false;
    return blank();
  }
  try {
    const saved = JSON.parse(raw);
    const state = parse(saved);
    base = held(state);
    baseRaw = raw;
    newer = fromNewer(saved) ? saved : null;
    return state;
  } catch {
    // A damaged save: start over.
    return blank();
  }
}

export const store = $state(load());

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Both lists as one, newest first, with each record once. Of two that share a key, the later one wins (a test started again),
 * and on the same date the one in `first`.
 */
function union(first, second, keyOf, limit) {
  const records = new Map();
  for (const x of [...first, ...second]) {
    const kept = records.get(keyOf(x));
    if (!kept || x.date > kept.date) records.set(keyOf(x), x);
  }
  return [...records]
    .sort(([ka, a], [kb, b]) => b.date - a.date || (ka < kb ? -1 : 1))
    .slice(0, limit)
    .map(([, x]) => x);
}

const sameAttempt = (a, b) => Boolean(a && b) && a.seed === b.seed && a.started === b.started;
/** Whether test `a` started after test `b`. The seed settles a tie, so every tab picks the same one. */
const startedAfter = (a, b) => a.started > b.started || (a.started === b.started && a.seed > b.seed);
const pick = (mine, before, theirs) => (mine !== before ? mine : theirs);

/**
 * One saved test from this tab's and storage's, given the results storage holds. `shown` is the test for this tab's screens,
 * `stored` the one to save, and `dropped` the key of a result this tab recorded for a test another tab had already finished.
 */
function mergeTest(mine, theirs, results) {
  const both = (test) => ({ shown: test, stored: test });
  if (sameAttempt(mine, theirs)) {
    // The first finish to reach storage stands: its result is already in the history.
    if (theirs.finished) return { ...both(theirs), dropped: mine.finished && mine.finished !== theirs.finished ? resultKey({ date: mine.finished, seed: mine.seed }) : null };
    if (mine.finished) return both(mine);
    // Both tabs are in the same running test: each question takes the answer changed since the last save, and time spent adds up.
    // An answer is never taken back, so a blank in storage for a question answered here is a save that missed the answer.
    const before = sameAttempt(base.test, mine) ? base.test : theirs;
    return both({
      ...mine,
      answers: mine.answers.map((answer, i) => pick(answer, before.answers[i], theirs.answers[i]) ?? answer),
      times: mine.times.map((seconds, i) => (seconds === before.times[i] ? theirs.times[i] : Math.min(MAX_SECONDS, Math.max(0, Math.round((theirs.times[i] + seconds - before.times[i]) * 10) / 10)))),
      current: pick(mine.current, before.current, theirs.current),
    });
  }
  // A test cleared in one tab is gone from both, unless a different one has been started since.
  if (!mine) return both(sameAttempt(base.test, theirs) && !aside ? null : theirs);
  if (!theirs) return both(sameAttempt(base.test, mine) ? null : mine);
  // Two different tests. One started since this tab's last save replaces the one storage held before, whatever the clock says,
  // and of two started since, storage keeps the one started last.
  const mineNew = !sameAttempt(mine, base.test) && !sameAttempt(mine, aside);
  const theirsNew = !sameAttempt(theirs, base.test);
  const stored = mineNew && (!theirsNew || startedAfter(mine, theirs)) ? mine : theirs;
  // A test running here plays on in this tab unless another tab has finished it,
  // and a finished one stays on screen until another tab starts a new test.
  const stays = isRunning(mine) ? !results.some((h) => h.seed === mine.seed && h.started === mine.started) : !theirsNew;
  return { shown: stored === mine || stays ? mine : theirs, stored };
}

/** One practice session from this tab's and storage's. */
function mergePractice(mine, theirs) {
  const before = base.practice;
  if (same(theirs, before)) return mine;
  if (same(mine, before)) return theirs;
  // Both changed. A session cleared in one tab stays cleared, and one started since replaces the old one.
  const isNew = (p) => p !== null && p.seed !== before?.seed;
  if (!mine || !theirs || mine.seed !== theirs.seed) {
    if (isNew(mine) !== isNew(theirs)) return isNew(mine) ? mine : theirs;
    if (!mine || !theirs) return null;
    // Two sessions started at once: every tab keeps the same one.
    return mine.done > theirs.done || (mine.done === theirs.done && mine.seed > theirs.seed) ? mine : theirs;
  }
  // The same session answered in both tabs: go on from the puzzle further along, and count every answer.
  const ahead = theirs.count > mine.count || (theirs.count === mine.count && theirs.choice !== null && mine.choice === null) ? theirs : mine;
  if (before?.seed !== mine.seed) return ahead;
  const done = Math.min(MAX_COUNT, theirs.done + Math.max(0, mine.done - before.done));
  const right = Math.min(done, theirs.right + Math.max(0, mine.right - before.right));
  return { ...ahead, done, right };
}

/**
 * Merge this tab's state with what storage holds, show the result here and save it.
 * `heard` is the value from another tab's storage event, used when storage itself can't be read.
 */
function sync(heard) {
  if (heard === undefined && !canSave) return;
  // The lists stay as they are in the store: copying a long history on every answer would cost more than the save itself.
  const mine = { theme: store.theme, test: $state.snapshot(store.test), history: store.history, practice: $state.snapshot(store.practice), log: store.log, begun: store.begun };
  let raw = heard;
  let canRead = true;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Without knowing what storage holds, a save could erase it: the event's value is shown here and nothing is written.
    if (heard === undefined) return;
    canRead = false;
  }
  // A save cleared since the event has nothing left to merge.
  if (heard !== undefined && !raw) return;

  // Storage this tab has already merged holds no result, practice answer or started test that isn't here too.
  let theirs = { ...base, history: [], log: [], begun: [] };
  let changed = false;
  if (raw === null) newer = null;
  else if (raw !== baseRaw) {
    try {
      const saved = JSON.parse(raw);
      theirs = parse(saved);
      changed = true;
      newer = fromNewer(saved) ? saved : null;
      // Another generator's test and practice can't be used here, so they count as unchanged.
      if (saved?.generator !== GENERATOR) Object.assign(theirs, { test: base.test, practice: base.practice });
    } catch {
      // A damaged save: this tab's state replaces it.
      newer = null;
    }
  }

  const test = mergeTest(mine.test, theirs.test, theirs.history);
  aside = test.shown === test.stored ? null : test.shown;
  // Storage's copy of a record wins a tie, so every tab ends up with the same one.
  const kept = test.dropped ? mine.history.filter((h) => resultKey(h) !== test.dropped) : mine.history;
  const history = changed ? union(theirs.history, kept, resultKey, HISTORY_LENGTH) : kept;
  const shown = {
    theme: mine.theme !== base.theme ? mine.theme : (theirs.theme ?? mine.theme),
    test: test.shown,
    history,
    practice: changed ? mergePractice(mine.practice, theirs.practice) : mine.practice,
    log: changed ? union(theirs.log, mine.log, JSON.stringify, LOG_LENGTH) : mine.log,
    begun: changed ? union(theirs.begun, mine.begun, begunKey, HISTORY_LENGTH) : mine.begun,
  };
  for (const [key, value] of Object.entries(shown)) if (value !== mine[key] && !same(value, mine[key])) store[key] = value;
  // A test this tab had on screen, replaced by another tab's new one, hands its route over: the old seed would read as a shared test.
  if (mine.test && shown.test && shown.test.seed !== mine.test.seed) {
    const [page, seed] = untrack(() => route.path);
    if (page === 'test' && seed === mine.test.seed) go(`test/${shown.test.seed}`, { replace: true });
  }

  let stored = { ...shown, test: test.stored };
  let written;
  let adding = [];
  if (newer) {
    // Only what this tab has that the newer save lacks goes in; its own test and practice stay as they are.
    const list = (records) => (Array.isArray(records) ? records : []);
    const lacking = (records, theirRecords, keyOf) => {
      for (const x of theirRecords) known.add(keyOf(x));
      return records.filter((x) => !known.has(keyOf(x)));
    };
    const results = lacking(history, list(newer.history).filter(isResult), resultKey);
    const attempts = lacking(shown.log, list(newer.log).filter(isAttempt), JSON.stringify);
    adding = [...results.map(resultKey), ...attempts.map((a) => JSON.stringify(a))];
    written = adding.length || shown.theme !== theirs.theme ? JSON.stringify({ ...newer, theme: shown.theme, history: [...results, ...list(newer.history)], log: [...attempts, ...list(newer.log)] }) : raw;
    stored = { ...stored, test: theirs.test, practice: theirs.practice };
  } else {
    written = JSON.stringify({ generator: GENERATOR, ...stored });
    // A tab still on a version from before `begun` drops it from every save it writes. Adding it back each time would have
    // the two tabs rewrite the save in turn without end, so a save that lacks only that stays as it is.
    if (raw && !raw.includes('"begun":') && JSON.stringify({ generator: GENERATOR, ...stored, begun: undefined }) === raw) written = raw;
  }

  let inStorage = raw;
  if (written !== raw && canSave && canRead) {
    try {
      localStorage.setItem(KEY, written);
      inStorage = written;
    } catch {
      // Private browsing can block storage; the app still works for this visit.
    }
  }
  // After a failed write storage still holds what was read, and this tab's changes stay its own.
  if (inStorage === written) {
    for (const key of adding) known.add(key);
    if (newer && written !== raw) newer = JSON.parse(written);
    base = held(stored);
  } else base = held(theirs);
  baseRaw = inStorage;
}

$effect.root(() => {
  $effect(() => sync());
});

addEventListener('storage', (event) => {
  // An event can arrive after later saves, so the merge reads what storage holds now, which is never older than the event's value.
  if (event.storageArea === localStorage && event.key === KEY && event.newValue) sync(event.newValue);
});

const prefersLight = new MediaQuery('(prefers-color-scheme: light)', false);

/** The theme on screen: your choice, or the system's. */
export const currentTheme = () => store.theme ?? (prefersLight.current ? 'light' : 'dark');

let themeTransition = null;

export function toggleTheme() {
  // The view transition snapshots the page once this returns, so the new theme must already be on screen.
  const apply = () => flushSync(() => (store.theme = currentTheme() === 'dark' ? 'light' : 'dark'));
  if (themeTransition) {
    themeTransition.skipTransition();
    apply();
  } else if (document.startViewTransition && !prefersReducedMotion.current) {
    themeTransition = document.startViewTransition(apply);
    themeTransition.finished.then(() => {
      themeTransition = null;
    });
  } else apply();
}

const tests = new Map();
/** The test being built: its seed, and the function that adds its next puzzle. */
let partial = null;

/** Add one puzzle to a seed's test, carrying on a build already under way. Returns whether the test is complete. */
function buildStep(seed) {
  if (partial?.seed !== seed) partial = { seed, next: testBuilder(seed) };
  const puzzles = partial.next();
  if (!puzzles) return false;
  partial = null;
  tests.set(seed, puzzles);
  if (tests.size > 3) tests.delete(tests.keys().next().value);
  return true;
}

/** A test's puzzles, keeping the last few built in memory. */
export function puzzlesFor(seed) {
  while (!tests.has(seed)) buildStep(seed);
  const puzzles = tests.get(seed);
  // The test used last is the last to leave.
  tests.delete(seed);
  tests.set(seed, puzzles);
  return puzzles;
}

let upcoming = randomSeed();

/**
 * Build a test ahead of time (the next new one, unless given a seed), so starting it is instant. The work
 * runs a puzzle at a time while the browser is idle, so a frame or a tap never waits for the whole build,
 * and a tap that comes first builds only what's left. Returns a function that stops the work.
 */
export function prepareTest(seed = upcoming) {
  const later = window.requestIdleCallback ?? setTimeout;
  let id = later(function step(idle) {
    // The next idle callback can be 50 ms away, so keep building while this one has time left.
    // A browser without idle callbacks gives no time budget, so it builds one puzzle per turn.
    try {
      do {
        if (tests.has(seed) || buildStep(seed)) return;
      } while (idle?.timeRemaining() > 0);
    } catch (error) {
      // No screen boundary catches an error here. Stop, and leave it to the tap that starts the test, which shows it.
      console.error(error);
      return;
    }
    id = later(step);
  });
  return () => (window.cancelIdleCallback ?? clearTimeout)(id);
}

export function startTest(seed = upcoming) {
  if (seed === upcoming) upcoming = randomSeed();
  const now = Date.now();
  const begun = { seed, date: now, generator: GENERATOR };
  store.begun = [begun, ...store.begun.filter((b) => begunKey(b) !== begunKey(begun))].slice(0, HISTORY_LENGTH);
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
export function spendTime(i, seconds, session = store.test) {
  const test = store.test;
  if (!isRunning(test) || test.seed !== session.seed || test.started !== session.started) return;
  // A phone can put the tab to sleep and wake it after the deadline; time past the deadline wasn't spent on the puzzle.
  const spent = seconds - Math.max(0, (Date.now() - test.deadline) / 1000);
  if (spent > 0) test.times[i] = Math.min(MAX_SECONDS, Math.round((test.times[i] + spent) * 10) / 10);
}

/** A short name for a puzzle's style: its family and the rules on its changing attributes, like "tiles:xor". */
export const kindOf = (puzzle) => `${puzzle.family}:${puzzle.rules.map((r) => r.rule).sort().join('+')}`;

/** Seconds the test took: never below zero, even if the clock was set back during it. */
export const elapsed = (test) => Math.max(0, Math.round((test.finished - test.started) / 1000));

/** End the running test and record its result. Returns whether that test is finished now: another tab may have cleared or replaced it. */
export function finishTest() {
  const mine = store.test && { seed: store.test.seed, started: store.test.started };
  // Another tab may have answered or finished this test since this tab last heard from it, and the result is final.
  untrack(sync);
  const test = store.test;
  if (!sameAttempt(test, mine)) return false;
  if (test.finished) return true;
  test.finished = Math.min(Date.now(), test.deadline);
  const puzzles = puzzlesFor(test.seed);
  store.history = [
    {
      seed: test.seed,
      score: scoreOf(test),
      total: test.answers.length,
      seconds: elapsed(test),
      date: test.finished,
      started: test.started,
      answers: [...test.answers],
      generator: GENERATOR,
      timedOut: test.finished >= test.deadline,
      times: [...test.times],
      kinds: puzzles.map(kindOf),
      outcomes: puzzles.map((p, i) => (test.answers[i] == null ? '-' : test.answers[i] === p.answer ? 'r' : 'w')).join(''),
    },
    ...store.history,
  ].slice(0, HISTORY_LENGTH);
  return true;
}

/** Whether a past test can be opened again: its answers were kept and the same generator still builds its puzzles. */
export const canReview = (h) => Array.isArray(h.answers) && h.answers.length === TEST_LENGTH && h.generator === GENERATOR;

/** The past test a link names. Links made before results had keys carry only the date. */
export const pastTest = (date, seed) => store.history.find((h) => String(h.date) === String(date) && (seed === undefined || h.seed === seed)) ?? null;

/** Whether this player started a test from this seed that the current generator builds, finished or not. */
export const hasBegun = (seed) => store.begun.some((b) => b.seed === seed && b.generator === GENERATOR);

/** A test left open past its deadline ends at the deadline. */
export function expireTest() {
  if (isRunning(store.test) && Date.now() >= store.test.deadline) finishTest();
}

/** Drop the saved work whose seed can't be built: the practice if that's the screen that failed, the test otherwise. A past result ('history') isn't saved work, so both are kept. */
export function clearUnbuildable(page) {
  if (page === 'history') return;
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
