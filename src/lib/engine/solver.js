/**
 * The solver checks puzzles without knowing how they were made. It holds a
 * library of hypotheses a person might try on one attribute, keeps the
 * ones the eight visible cells satisfy, and collects every value of the
 * missing cell that one of them allows.
 *
 * A puzzle is fair only when that set is exactly the intended answer for
 * every attribute. If two plausible rules disagree, the puzzle is rejected.
 */

import { MIRRORS, MISSING, SYSTEMS } from './grid.js';
import { difference, isNumeric, plus, solverValues } from './kinds.js';

const ALL = Object.keys(SYSTEMS);
const ROWS_COLS = ['rows', 'cols'];

/** A hypothesis is a list of constraints, each a test on some cells. */
const constraint = (cells, test) => ({ cells, test });

const hypothesis = (name, constraints) => ({
  name,
  pre: constraints.filter((c) => !c.cells.includes(MISSING)),
  last: constraints.filter((c) => c.cells.includes(MISSING)),
});

const holds = (c, g) => c.test(c.cells.map((i) => g[i]));

/** Every line of the system passes `test`. */
const eachLine = (system, test) => SYSTEMS[system].map((line) => constraint(line, test));

/** The other lines of the system match the first one under `same`. */
const likeFirst = (system, same) => {
  const [first, ...rest] = SYSTEMS[system];
  return rest.map((line) => constraint([...first, ...line], (v) => same(v.slice(0, 3), v.slice(3))));
};

const sorted = (v) => [...v].sort((a, b) => a - b).join();
const total = (v) => v[0] + v[1] + v[2];

/** Per-slot counts of three masks, packed in base 4 so they compare as one number. */
const spread = (mask) => {
  let out = 0;
  for (let i = 0; mask >> i; i++) if ((mask >> i) & 1) out += 4 ** i;
  return out;
};
const slotCounts = (v) => spread(v[0]) + spread(v[1]) + spread(v[2]);

const SET_OPS = {
  xor: (a, b) => a ^ b,
  or: (a, b) => a | b,
  and: (a, b) => a & b,
  minus: (a, b) => a & ~b,
  rminus: (a, b) => b & ~a,
};

function build(attr) {
  const list = [];
  const add = (name, constraints) => list.push(hypothesis(name, constraints));

  // Any kind: lines that repeat a value, lines that share a multiset, mirror symmetry.
  for (const s of ALL) add(`${s} same`, eachLine(s, ([a, b, c]) => a === b && b === c));
  for (const s of ALL) add(`${s} same values`, likeFirst(s, (x, y) => sorted(x) === sorted(y)));
  for (const [name, map] of Object.entries(MIRRORS)) {
    add(
      `mirror ${name}`,
      map.flatMap((j, i) => (i < j ? [constraint([i, j], ([a, b]) => a === b)] : [])),
    );
  }

  // Additive in rows and columns: cell = f(row) + g(column), wrapped for directions, XOR for sets.
  if (attr.kind !== 'category') {
    const d = difference(attr);
    add(
      'separable',
      [[4, 3, 1, 0], [5, 3, 2, 0], [7, 6, 1, 0], [8, 6, 2, 0]].map((cells) =>
        constraint(cells, ([a, b, c, e]) => d(a, b) === d(c, e)),
      ),
    );
  }

  if (isNumeric(attr)) {
    const d = difference(attr);
    // Each line steps evenly; each line may have its own step.
    for (const s of ROWS_COLS) add(`${s} arithmetic`, eachLine(s, ([a, b, c]) => d(b, a) === d(c, b)));
  }

  if (attr.kind === 'quantity' || attr.kind === 'cyclic') {
    const p = plus(attr);
    for (const s of ROWS_COLS) {
      add(`${s} sum`, eachLine(s, ([a, b, c]) => c === p(a, b)));
      add(`${s} difference`, eachLine(s, ([a, b, c]) => a === p(b, c)));
      add(`${s} reverse difference`, eachLine(s, ([a, b, c]) => b === p(a, c)));
    }
  }

  if (attr.kind === 'quantity') {
    for (const s of ROWS_COLS) add(`${s} same total`, likeFirst(s, (x, y) => total(x) === total(y)));
  }

  if (attr.kind === 'set') {
    for (const [name, op] of Object.entries(SET_OPS)) {
      for (const s of ROWS_COLS) add(`${s} ${name}`, eachLine(s, ([a, b, c]) => c === op(a, b)));
    }
    for (const s of ALL) add(`${s} slot counts`, likeFirst(s, (x, y) => slotCounts(x) === slotCounts(y)));
    for (const t of attr.geometry?.transforms ?? []) {
      for (const s of ROWS_COLS) {
        add(`${s} ${t.name}`, eachLine(s, ([a, b, c]) => t.apply(a) === b && t.apply(b) === c));
      }
    }
  }
  return list;
}

const cache = new WeakMap();
function hypotheses(attr) {
  if (!cache.has(attr)) cache.set(attr, build(attr));
  return cache.get(attr);
}

/**
 * One idea for sets that is not a single list of constraints: each slot
 * keeps to a system of its own and is on or off along every line of it.
 * Returns the masks this allows for the missing cell, or none if some slot
 * fits no system.
 */
function ownLines(attr, grid) {
  let masks = [0];
  for (let slot = 0; slot < attr.size; slot++) {
    const bit = grid.map((v) => (v >> slot) & 1);
    const flat = (line) => bit[line[0]] === bit[line[1]] && bit[line[1]] === bit[line[2]];
    const forced = new Set(
      Object.values(SYSTEMS).flatMap(([a, b, [x, y]]) => (flat(a) && flat(b) && bit[x] === bit[y] ? [bit[x]] : [])),
    );
    if (!forced.size) return [];
    masks = masks.flatMap((m) => [...forced].map((b) => m | (b << slot)));
  }
  return masks;
}

/** Every value of the missing cell that some hypothesis fitting the visible cells allows. */
export function candidates(attr, grid) {
  const g = [...grid];
  const live = hypotheses(attr).filter((h) => h.pre.every((c) => holds(c, g)));
  const own = new Set(attr.kind === 'set' ? ownLines(attr, grid) : []);
  return solverValues(attr).filter((v) => {
    g[MISSING] = v;
    return own.has(v) || live.some((h) => h.last.every((c) => holds(c, g)));
  });
}

/** Names of the hypotheses that fit the whole grid, answer included. */
export const explanations = (attr, grid) => [
  ...hypotheses(attr)
    .filter((h) => [...h.pre, ...h.last].every((c) => holds(c, grid)))
    .map((h) => h.name),
  ...(attr.kind === 'set' && ownLines(attr, grid).includes(grid[MISSING]) ? ['own lines'] : []),
];

/**
 * True when the visible cells force the answer. Attributes with a numeric
 * view (a set's count, a polygon's sides) must also not suggest a different
 * number through that view.
 */
export function determined(attr, grid) {
  const found = candidates(attr, grid);
  if (found.length !== 1 || found[0] !== grid[MISSING]) return false;
  const view = attr.projection;
  if (!view) return true;
  const numbers = grid.map(view.of);
  if (numbers.some((n) => n == null)) return true;
  return candidates(view.attr, numbers).every((n) => n === numbers[MISSING]);
}
