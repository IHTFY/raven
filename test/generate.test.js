import { describe, expect, it } from 'vitest';
import { figureKey } from '../src/lib/engine/draw.js';
import { FAMILIES } from '../src/lib/engine/families/index.js';
import { EASIEST, HARDEST, TEST_LENGTH, generatePuzzle, generateTest } from '../src/lib/engine/generate.js';
import { range, values } from '../src/lib/engine/kinds.js';
import { createRng } from '../src/lib/engine/rng.js';
import { RULES } from '../src/lib/engine/rules.js';
import { candidates, determined } from '../src/lib/engine/solver.js';

const FAMILY = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));

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

  it('generate quickly', () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) generateTest(`speed/${i}`);
    expect((performance.now() - start) / 10).toBeLessThan(400);
  });
});
