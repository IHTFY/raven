import { describe, expect, it } from 'vitest';
import { figureKey } from '../src/lib/engine/draw.js';
import { FAMILIES } from '../src/lib/engine/families/index.js';
import { EASIEST, HARDEST, TEST_LENGTH, generatePuzzle, generateTest, planScore } from '../src/lib/engine/generate.js';
import { range, values } from '../src/lib/engine/kinds.js';
import { createRng } from '../src/lib/engine/rng.js';
import { RULES } from '../src/lib/engine/rules.js';
import { candidates, determined } from '../src/lib/engine/solver.js';

const FAMILY = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
const RULE = Object.fromEntries(RULES.map((r) => [r.id, r]));

/** The kind of each rule, from plainest to subtlest. Every rule needs one. */
const KIND = {
  rows: 'line',
  cols: 'line',
  overlay: 'overlay',
  progression: 'step',
  progressionWide: 'step',
  move: 'move',
  latinDown: 'latin',
  latinUp: 'latin',
  sum: 'arithmetic',
  difference: 'arithmetic',
  or: 'union',
  minus: 'union',
  rminus: 'union',
  partition: 'split',
  complement: 'split',
  xor: 'logic',
  and: 'logic',
  ownLines: 'logic',
};
/** The kind of a puzzle's hardest rule. */
const lead = (p) => KIND[p.rules.reduce((a, r) => (RULE[r.rule].score > RULE[a.rule].score ? r : a)).rule];

/** Ranks of a list of numbers, ties sharing their mean rank. */
const ranks = (v) => v.map((x) => v.filter((y) => y < x).length + (v.filter((y) => y === x).length - 1) / 2);

/** Spearman rank correlation: how closely two lists agree on order, from −1 to 1. */
function rankCorrelation(a, b) {
  const centered = (v) => {
    const r = ranks(v);
    const mean = r.reduce((s, x) => s + x, 0) / r.length;
    return r.map((x) => x - mean);
  };
  const [x, y] = [centered(a), centered(b)];
  const dot = (u, v) => u.reduce((s, ui, i) => s + ui * v[i], 0);
  return dot(x, y) / Math.sqrt(dot(x, x) * dot(y, y));
}

/** Puzzles across the whole difficulty range from many seeds. */
const SAMPLE = range(0, 399).map((i) => generatePuzzle(`sample/${i}`, EASIEST + ((HARDEST - EASIEST) * (i % 20)) / 19));

/** Scalar values and each slot of each set, as a flat list of features. */
const features = (family, cell) =>
  family.attrs.flatMap((attr) =>
    attr.kind === 'set' ? range(0, attr.size - 1).map((i) => (cell[attr.name] >> i) & 1) : [cell[attr.name]],
  );

describe('generated puzzles', () => {
  it('force exactly the intended answer for every attribute', () => {
    for (const p of SAMPLE) {
      const family = FAMILY[p.family];
      for (const attr of family.attrs) {
        const grid = p.cells.map((c) => c[attr.name]);
        expect(candidates(attr, grid), `${p.seed} ${attr.name}`).toEqual([grid[8]]);
        expect(determined(attr, grid), `${p.seed} ${attr.name}`).toBe(true);
      }
    }
  });

  it('have six different-looking options and exactly one that fits', () => {
    for (const p of SAMPLE) {
      const family = FAMILY[p.family];
      expect(p.options).toHaveLength(6);
      expect(p.options[p.answer]).toEqual(p.cells[8]);
      expect(new Set(p.options.map((o) => figureKey(family.render(o)))).size, p.seed).toBe(6);
      const allowed = family.attrs.map((attr) => candidates(attr, p.cells.map((c) => c[attr.name])));
      const fits = p.options.filter((o) => family.attrs.every((attr, k) => allowed[k].includes(o[attr.name])));
      expect(fits, p.seed).toEqual([p.cells[8]]);
    }
  });

  it('only use valid pictures', () => {
    for (const p of SAMPLE) {
      const family = FAMILY[p.family];
      for (const cell of [...p.cells, ...p.options]) {
        expect(family.valid?.(cell) ?? true, p.seed).toBe(true);
        for (const attr of family.attrs) expect(values(attr), `${p.seed} ${attr.name}`).toContain(cell[attr.name]);
      }
    }
  });

  it('give no option away by being the most typical one', () => {
    for (const p of SAMPLE) {
      const family = FAMILY[p.family];
      const f = p.options.map((o) => features(family, o));
      const distance = (a, b) => a.filter((v, i) => v !== b[i]).length;
      const totals = f.map((a) => f.reduce((sum, b) => sum + distance(a, b), 0));
      expect(new Set(totals).size, `${p.seed} ${p.design} ${totals}`).toBe(1);
    }
  });

  it('explain every changing attribute', () => {
    for (const p of SAMPLE) {
      expect(p.rules.length).toBeGreaterThan(0);
      for (const r of p.rules) expect(r.text).toMatch(/^[A-Z].*\.$/);
      for (const r of p.rules) expect(r.text).not.toMatch(/undefined|NaN|\[object/);
    }
  });
});

describe('rules', () => {
  it('each produce solvable grids for every attribute they apply to', () => {
    const rng = createRng('coverage');
    for (const family of FAMILIES) {
      for (const attr of family.attrs) {
        for (const rule of RULES.filter((r) => r.applies(attr))) {
          const ok = range(0, 199).some(() => {
            const made = rule.make(attr, rng);
            return made && determined(attr, made.grid);
          });
          expect(ok, `${family.id}.${attr.name} ${rule.id}`).toBe(true);
        }
      }
    }
  });
});

describe('figures', () => {
  /** Every combination of attribute values, or a random sample when there are too many. */
  function domain(family) {
    const lists = family.attrs.map(values);
    const size = lists.reduce((n, l) => n * l.length, 1);
    const cell = (pick) => Object.fromEntries(family.attrs.map((a, k) => [a.name, pick(k)]));
    if (size <= 6000) {
      return range(0, size - 1).map((n) =>
        cell((k) => {
          const below = lists.slice(k + 1).reduce((m, l) => m * l.length, 1);
          return lists[k][Math.floor(n / below) % lists[k].length];
        }),
      );
    }
    const rng = createRng(family.id);
    return range(0, 5999).map(() => cell((k) => rng.pick(lists[k])));
  }

  it.each(FAMILIES.map((f) => [f.id, f]))('%s draws different values differently', (_, family) => {
    const seen = new Map();
    for (const cell of domain(family).filter((c) => family.valid?.(c) ?? true)) {
      const key = figureKey(family.render(cell));
      const id = JSON.stringify(cell);
      if (seen.has(key)) expect(seen.get(key), `same picture for ${seen.get(key)} and ${id}`).toBe(id);
      seen.set(key, id);
    }
  });
});

describe('tests', () => {
  const TESTS = range(0, 39).map((i) => generateTest(`kinds/${i}`));

  it('give every rule a kind', () => {
    expect(RULES.filter((r) => r.id !== 'constant' && !(r.id in KIND)).map((r) => r.id)).toEqual([]);
  });

  it('come out the same for the same seed', () => {
    expect(JSON.stringify(generateTest('same'))).toBe(JSON.stringify(generateTest('same')));
  });

  it('get harder and keep switching styles', () => {
    for (const seed of range(0, 49).map((i) => `styles/${i}`)) {
      const test = generateTest(seed);
      expect(test).toHaveLength(TEST_LENGTH);
      const third = Math.floor(TEST_LENGTH / 3);
      const mean = (list) => list.reduce((s, p) => s + p.score, 0) / list.length;
      expect(mean(test.slice(0, third))).toBeLessThan(mean(test.slice(-third)));
      const repeats = test.filter((p, i) => i > 0 && p.group === test[i - 1].group).length;
      expect(repeats, seed).toBe(0);
    }
  });

  it('have at most one puzzle where every picture in a row (or column) is the same', () => {
    const along = (dir) => (p) => p.rules.every((r) => r.rule === dir);
    for (const seed of range(0, 29)) {
      const simple = generateTest(`simple/${seed}`).filter((p) => along('rows')(p) || along('cols')(p));
      expect(simple.length, `seed simple/${seed}`).toBeLessThanOrEqual(1);
    }
  });

  it('can set one attribute by row and another by column', () => {
    const crossed = (p) =>
      p.rules.every((r) => r.rule === 'rows' || r.rule === 'cols') && new Set(p.rules.map((r) => r.rule)).size === 2;
    const tests = range(0, 29).map((seed) => generateTest(`crossed/${seed}`));
    expect(tests.filter((test) => test.some(crossed)).length).toBeGreaterThan(15);
  });

  it('use set rules in more than half the puzzles of the last third', () => {
    // Overlay is left out: it builds each picture from a row group and a column group, an early-test idea.
    const SET_RULES = new Set(['or', 'xor', 'and', 'minus', 'rminus', 'partition', 'complement', 'ownLines']);
    const last = range(0, 29).flatMap((i) => generateTest(`mix/${i}`).slice(Math.ceil((2 * TEST_LENGTH) / 3)));
    const share = last.filter((p) => p.rules.some((r) => SET_RULES.has(r.rule))).length / last.length;
    expect(share).toBeGreaterThan(0.5);
  });

  it('rank styles of puzzle in the order the Mensa Norway test places them', () => {
    // [question number in that test, our family, rule per changing attribute] for items our engine can build.
    const REFERENCE = [
      [2, 'nested', { outer: 'rows', inner: 'cols' }],
      [3, 'nested', { outer: 'rows', inner: 'latinDown' }],
      [4, 'arrow', { dir: 'rows', tail: 'cols' }],
      [5, 'arrow', { dir: 'progression', tail: 'rows' }],
      [6, 'tiles', { tiles: 'overlay' }],
      [8, 'shapes', { shape: 'latinDown', fill: 'latinUp' }],
      [9, 'marks', { boxes: 'cols', dots: 'rows' }],
      [10, 'kite', { dir: 'progressionWide', half: 'rows' }],
      [11, 'parts', { parts: 'rminus' }],
      [12, 'kite', { dir: 'progressionWide', half: 'latinDown' }],
      [13, 'shapes', { shape: 'latinDown', fill: 'latinDown' }],
      [15, 'chevron', { dir: 'progressionWide', dots: 'latinDown' }],
      [16, 'umbrella', { dir: 'progressionWide', fill: 'latinDown' }],
      [19, 'parts', { parts: 'partition' }],
      [20, 'lines', { segments: 'xor' }],
      [21, 'lines', { segments: 'xor' }],
      [24, 'spokes', { spokes: 'xor' }],
      [25, 'marks', { dots: 'and' }],
      [26, 'marks', { boxes: 'xor', dots: 'and' }],
      [27, 'vee', { dir: 'progressionWide', angle: 'latinDown' }],
      [28, 'lines', { segments: 'xor' }],
      [31, 'tiles', { tiles: 'xor' }],
    ];
    const scores = REFERENCE.map(([, id, rules]) => {
      const family = FAMILY[id];
      expect(Object.keys(rules).every((name) => family.attrs.some((attr) => attr.name === name))).toBe(true);
      expect(Object.values(rules).every((rule) => rule in RULE)).toBe(true);
      return planScore(family, family.attrs.map((attr) => RULE[rules[attr.name] ?? 'constant']));
    });
    expect(rankCorrelation(REFERENCE.map(([q]) => q), scores)).toBeGreaterThan(0.85);
  });

  it('score rules from plain to subtle: lines, then steps, then offsets, then set logic', () => {
    const top = (ids) => Math.max(...ids.map((id) => RULE[id].score));
    const bottom = (ids) => Math.min(...ids.map((id) => RULE[id].score));
    const LATIN = ['latinDown', 'latinUp'];
    expect(top(['rows', 'cols', 'overlay'])).toBeLessThan(bottom(['progression', 'progressionWide']));
    expect(top(['progression', 'progressionWide'])).toBeLessThan(bottom(LATIN));
    expect(top(LATIN)).toBeLessThan(bottom(['xor', 'and', 'partition', 'complement', 'ownLines']));
    // Set logic on one attribute and an offset on another is harder than either alone.
    const marks = (boxes, dots) => planScore(FAMILY.marks, [RULE[boxes], RULE[dots]]);
    expect(marks('latinDown', 'xor')).toBeGreaterThan(marks('constant', 'xor'));
    expect(marks('latinDown', 'xor')).toBeGreaterThan(marks('latinDown', 'constant'));
  });

  it('keep offsets (Latin squares) out of the first five questions, nearly always', () => {
    const opening = TESTS.flatMap((test) => test.slice(0, 5));
    const latin = opening.filter((p) => p.rules.some((r) => KIND[r.rule] === 'latin'));
    expect(latin.length / opening.length).toBeLessThan(0.05);
  });

  it('place each kind of rule near where the Mensa Norway test does', () => {
    // Question numbers in that test, by the kind of its hardest rule (our reading; 33 to 35 left out as unread).
    // A kind may sit up to six questions from Mensa's average: close to its order, not a copy of it.
    const MENSA = {
      line: [1, 2, 4, 9, 22],
      overlay: [6],
      step: [5, 10, 17],
      latin: [3, 8, 12, 13, 14, 15, 16, 23, 27],
      arithmetic: [7, 18, 29, 30],
      union: [11],
      split: [19],
      logic: [20, 21, 24, 25, 26, 28, 31, 32],
    };
    const mean = (list) => list.reduce((s, x) => s + x, 0) / list.length;
    const ours = Object.fromEntries(Object.keys(MENSA).map((kind) => [kind, []]));
    for (const test of TESTS) test.forEach((p, i) => ours[lead(p)]?.push(i + 1));
    for (const [kind, questions] of Object.entries(MENSA)) {
      expect(ours[kind].length, kind).toBeGreaterThan(0);
      expect(Math.abs(mean(ours[kind]) - mean(questions)), `${kind}: ours ${mean(ours[kind]).toFixed(1)}`).toBeLessThanOrEqual(6);
    }
  });

  it('still vary from test to test', () => {
    const type = (p) => `${p.family}:${p.rules.map((r) => `${r.attr}=${r.rule}`).join()}`;
    // No puzzle type takes more than a third of the tests at any question number.
    for (const i of range(0, TEST_LENGTH - 1)) {
      const counts = new Map();
      for (const test of TESTS) counts.set(type(test[i]), (counts.get(type(test[i])) ?? 0) + 1);
      expect(Math.max(...counts.values()) / TESTS.length, `question ${i + 1}`).toBeLessThanOrEqual(1 / 3);
    }
    // Two tests rarely put the same type of puzzle at the same question.
    let same = 0;
    let pairs = 0;
    for (const [a, first] of TESTS.entries()) {
      for (const second of TESTS.slice(a + 1)) {
        same += first.filter((p, i) => type(p) === type(second[i])).length / TEST_LENGTH;
        pairs++;
      }
    }
    expect(same / pairs).toBeLessThan(0.1);
    // Each test mixes many styles and kinds of rule.
    for (const test of TESTS) {
      expect(new Set(test.map((p) => p.family)).size).toBeGreaterThanOrEqual(7);
      expect(new Set(test.map(lead)).size).toBeGreaterThanOrEqual(6);
    }
  });

  it('generate quickly', () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) generateTest(`speed/${i}`);
    expect((performance.now() - start) / 10).toBeLessThan(400);
  });
});

describe('link seeds', () => {
  const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const linkSeed = (rng) => Array.from({ length: rng.int(1, 24) }, () => CHARS[rng.int(0, CHARS.length - 1)]).join('');
  /** Seeds that once failed, kept as fixed cases. */
  const FAILED = [];

  it('all build a test, none slowly', () => {
    // Any seed matching a shared link's pattern starts a test, so none may fail or stall. The same seeds run every time, so a failure repeats.
    const rng = createRng('link seeds');
    const seeds = [...FAILED, 'a', '0', 'Z'.repeat(24), '9'.repeat(24), ...range(0, 119).map(() => linkSeed(rng))];
    let slowest = { seed: null, ms: 0 };
    for (const seed of seeds) {
      const start = performance.now();
      const puzzles = generateTest(seed);
      const ms = performance.now() - start;
      if (ms > slowest.ms) slowest = { seed, ms };
      expect(puzzles, seed).toHaveLength(TEST_LENGTH);
    }
    expect(slowest.ms, `slowest seed: ${slowest.seed}`).toBeLessThan(1500);
  });
});

