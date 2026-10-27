/**
 * Statistics from what the browser has saved: finished tests (with their
 * per-puzzle times, styles, and outcomes when they were kept) and answered
 * practice puzzles. Everything here is pure, so it runs the same on a
 * central store's data later.
 */

/** Readable names for the rules, as they appear in a puzzle's kind. */
export const RULE_NAMES = {
  rows: 'Same along each row',
  cols: 'Same down each column',
  latinDown: 'Diagonals ↘',
  latinUp: 'Diagonals ↙',
  progression: 'Steady steps',
  progressionWide: 'Bigger steps',
  sum: 'Sum',
  difference: 'Difference',
  or: 'Union (A + B)',
  and: 'Intersection (A ∩ B)',
  xor: 'Exclusive or (A ⊕ B)',
  minus: 'First minus second',
  rminus: 'Second minus first',
  partition: 'Each part once',
  complement: 'Each part twice',
  move: 'Moves and turns',
  ownLines: 'Each part its own lines',
  overlay: 'Row group + column group',
};

export const FAMILY_NAMES = {
  shapes: 'Shapes',
  counts: 'Counting',
  tally: 'Tally',
  nested: 'Nested shapes',
  arrow: 'Arrows',
  kite: 'Kites',
  chevron: 'Chevrons',
  umbrella: 'Umbrellas',
  vee: 'Angles',
  clock: 'Clocks',
  tiles: 'Tiles',
  marks: 'Marks',
  lines: 'Lines',
  spokes: 'Spokes',
  parts: 'Parts',
};

/** "tiles:or+rows" → { family: 'tiles', rules: ['or', 'rows'] }. */
export function parseKind(kind) {
  const [family, rules = ''] = kind.split(':');
  return { family, rules: rules ? rules.split('+') : [] };
}

export const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** Headline numbers over finished tests. */
export function summary(history) {
  const scores = history.map((h) => h.score / h.total);
  return {
    tests: history.length,
    best: history.length ? Math.max(...history.map((h) => h.score)) : null,
    average: mean(history.map((h) => h.score)),
    share: mean(scores),
    seconds: median(history.map((h) => h.seconds)),
  };
}

/** Counts of test scores in bins of `width`, from 0 to the test length. */
export function histogram(history, total, width = 5) {
  const bins = Array.from({ length: Math.ceil((total + 1) / width) }, (_, k) => ({
    from: k * width,
    to: Math.min(total, (k + 1) * width - 1),
    count: 0,
  }));
  for (const h of history) if (h.total === total) bins[Math.min(bins.length - 1, Math.floor(h.score / width))].count++;
  return bins;
}

/** Median seconds and share right at each position of the test, over tests that kept their times. */
export function byPosition(history, total) {
  const kept = history.filter((h) => h.total === total && h.times && h.outcomes);
  return Array.from({ length: total }, (_, i) => {
    const answered = kept.filter((h) => h.outcomes[i] !== '-');
    return {
      position: i + 1,
      seconds: median(kept.map((h) => h.times[i])),
      right: answered.length ? answered.filter((h) => h.outcomes[i] === 'r').length / answered.length : null,
      count: kept.length,
    };
  });
}

/** Every answered puzzle: from tests that kept their styles, and from practice. Blanks are left out. */
export function attempts(history, log) {
  const fromTests = history.flatMap((h) =>
    h.kinds && h.outcomes
      ? h.kinds.flatMap((kind, i) =>
          h.outcomes[i] === '-' ? [] : [{ kind, right: h.outcomes[i] === 'r', seconds: h.times?.[i] ?? null, source: 'test' }],
        )
      : [],
  );
  return [...fromTests, ...log.map((a) => ({ kind: a.kind, right: a.right, seconds: a.seconds, source: 'practice' }))];
}

/**
 * Attempts grouped by `keysOf(kind)`, with the share right and the median
 * time, hardest first. Groups with fewer than `min` attempts are left out.
 */
export function difficulty(list, keysOf, min = 1) {
  const groups = new Map();
  for (const a of list) {
    for (const key of new Set(keysOf(a.kind))) {
      const g = groups.get(key) ?? { key, count: 0, right: 0, times: [] };
      g.count++;
      if (a.right) g.right++;
      if (a.seconds != null) g.times.push(a.seconds);
      groups.set(key, g);
    }
  }
  return [...groups.values()]
    .filter((g) => g.count >= min)
    .map(({ key, count, right, times }) => ({ key, count, share: right / count, seconds: median(times) }))
    .sort((a, b) => a.share - b.share || (b.seconds ?? 0) - (a.seconds ?? 0));
}

export const byRule = (list, min) => difficulty(list, (kind) => parseKind(kind).rules, min);
export const byFamily = (list, min) => difficulty(list, (kind) => [parseKind(kind).family], min);
/** Combinations of rules, whatever the family. */
export const byCombination = (list, min) => difficulty(list, (kind) => [parseKind(kind).rules.join('+')], min);

/** "or+rows" → "Union (A + B) · Same along each row". */
export const comboName = (key) => key.split('+').map((r) => RULE_NAMES[r] ?? r).join(' · ');
