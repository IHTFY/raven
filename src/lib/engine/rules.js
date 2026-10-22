/**
 * Generator rules. Each rule fills the 3×3 grid for one attribute and can
 * explain itself in a sentence. Scores feed the difficulty estimate.
 *
 * make(attr, rng) returns { grid, params } or null when a random draw is
 * unusable; the caller retries. Whether the result has a unique answer is
 * the solver's call, not the rule's.
 */

import { SYSTEMS, gridOf } from './grid.js';
import { commute } from './geometry.js';
import { mod, range, stepText, values } from './kinds.js';

const LINE = { rows: 'row', cols: 'column' };
const plural = (attr) => attr.plural ?? `${attr.label}s`;
const thing = (attr) => (attr.kind === 'set' ? `arrangement of ${attr.label}` : attr.label);
const things = (attr) => (attr.kind === 'set' ? `arrangements of ${attr.label}` : plural(attr));

/** Fill a grid one line at a time along a system of lines. */
const fromLines = (system, lines) => {
  const grid = Array(9);
  SYSTEMS[system].forEach((cells, k) => cells.forEach((cell, j) => (grid[cell] = lines[k][j])));
  return grid;
};

const distinct = (list) => new Set(list.map((v) => JSON.stringify(v))).size === list.length;

const retry = (fn) => {
  for (let i = 0; i < 30; i++) {
    const out = fn();
    if (out != null) return out;
  }
  return null;
};

const maskOf = (slots) => slots.reduce((m, i) => m | (1 << i), 0);

const randomMask = (attr, rng) => maskOf(rng.sample(range(0, attr.size - 1), rng.int(...attr.density)));

const pickValue = (attr, rng) => (attr.kind === 'set' ? randomMask(attr, rng) : rng.pick(values(attr)));

/** Three different values of the attribute. */
const three = (attr, rng) =>
  retry(() => {
    const v = [pickValue(attr, rng), pickValue(attr, rng), pickValue(attr, rng)];
    return distinct(v) ? v : null;
  });

const hasThree = (attr) => attr.kind === 'set' || values(attr).length >= 3;
const isSet = (min) => (attr) => attr.kind === 'set' && attr.size >= min;

const constantLines = (system) => (attr, rng) => {
  const v = three(attr, rng);
  return v && { grid: fromLines(system, v.map((x) => [x, x, x])), params: {} };
};

const latin = (sign) => (attr, rng) => {
  const v = three(attr, rng);
  return v && { grid: gridOf((r, c) => v[mod(c + sign * r, 3)]), params: {} };
};

/** Steps that keep three cells in a line distinct: never 0 or a half turn. */
const stepsFor = (attr, wide) => {
  const all = attr.kind === 'cyclic' ? range(1, Math.ceil(attr.size / 2) - 1) : [1, 2];
  return all.filter((s) => wide || s === 1).flatMap((s) => [s, -s]);
};

function progression(attr, rng, wide) {
  const steps = stepsFor(attr, wide);
  return retry(() => {
    const s = rng.pick(steps);
    const t = rng.pick(steps);
    if (wide && Math.max(Math.abs(s), Math.abs(t)) < 2) return null;
    if (attr.kind === 'cyclic') {
      const a = rng.int(0, attr.size - 1);
      return { grid: gridOf((r, c) => mod(a + s * c + t * r, attr.size)), params: { s, t } };
    }
    const low = Math.min(0, 2 * s) + Math.min(0, 2 * t);
    const high = Math.max(0, 2 * s) + Math.max(0, 2 * t);
    if (attr.min - low > attr.max - high) return null;
    const a = rng.int(attr.min - low, attr.max - high);
    return { grid: gridOf((r, c) => a + s * c + t * r), params: { s, t } };
  });
}

const canProgress = (wide) => (attr) =>
  (attr.kind === 'quantity' && attr.max - attr.min >= (wide ? 6 : 4)) || (attr.kind === 'cyclic' && attr.size >= (wide ? 8 : 4));

/** Rows (or columns) of [x, y, f(x, y)] with all values in range. */
function arithmetic(f) {
  const triples = (attr) =>
    values(attr).flatMap((x) => values(attr).map((y) => [x, y, f(x, y)])).filter(([, , z]) => z >= attr.min && z <= attr.max);
  return {
    applies: (attr) => attr.kind === 'quantity' && triples(attr).length >= 4,
    make(attr, rng) {
      const lines = rng.sample(triples(attr), 3);
      if (lines.every(([x, y]) => x === y)) return null;
      const dir = rng.pick(['rows', 'cols']);
      return { grid: fromLines(dir, lines), params: { dir } };
    },
  };
}

const SET_OPS = {
  xor: { score: 6, op: (a, b) => a ^ b, text: (l) => `shows the ${l} found in exactly one of the first two (shared ones cancel out)` },
  or: { score: 3, op: (a, b) => a | b, text: (l) => `shows all the ${l} from the first two together` },
  and: { score: 5.5, op: (a, b) => a & b, text: (l) => `shows only the ${l} that the first two share` },
  minus: { score: 3, op: (a, b) => a & ~b, text: (l) => `shows the first picture's ${l}, minus any that are in the second` },
  rminus: { score: 3, op: (a, b) => b & ~a, text: (l) => `shows the second picture's ${l}, minus any that are in the first` },
};

const setOp = ([id, { score, op, text }]) => ({
  id,
  score,
  applies: isSet(4),
  make(attr, rng) {
    const lines = [];
    for (let k = 0; k < 3; k++) {
      const line = retry(() => {
        const a = randomMask(attr, rng);
        const b = randomMask(attr, rng);
        const c = op(a, b);
        return c && c !== a && c !== b ? [a, b, c] : null;
      });
      if (!line) return null;
      lines.push(line);
    }
    if (!distinct(lines)) return null;
    const dir = rng.pick(['rows', 'cols']);
    return { grid: fromLines(dir, lines), params: { dir } };
  },
  explain: (attr, { dir }) => `In each ${LINE[dir]}, the third picture ${text(attr.label)}.`,
});

/** Each line splits one fixed group of slots across its three cells. */
const partition = (complement) => (attr, rng) => {
  const group = rng.sample(range(0, attr.size - 1), rng.int(3, Math.min(attr.size, 6)));
  const whole = maskOf(group);
  const lines = range(0, 2).map(() =>
    retry(() => {
      const owner = group.map(() => rng.int(0, 2));
      if (new Set(owner).size < 3) return null;
      return range(0, 2).map((k) => {
        const part = maskOf(group.filter((_, i) => owner[i] === k));
        return complement ? whole ^ part : part;
      });
    }),
  );
  if (lines.some((l) => !l) || !distinct(lines)) return null;
  const dir = rng.pick(['rows', 'cols']);
  return { grid: fromLines(dir, lines), params: { dir } };
};

function move(attr, rng) {
  const { transforms, motions } = attr.geometry;
  const pool = transforms.filter((t) => motions.includes(t.name));
  const T = rng.pick(pool);
  const U = rng.pick(pool.filter((u) => commute(T, u)));
  const base = randomMask(attr, rng);
  const power = (t, n, mask) => (n ? power(t, n - 1, t.apply(mask)) : mask);
  const grid = gridOf((r, c) => power(U, r, power(T, c, base)));
  const lines = [...SYSTEMS.rows, ...SYSTEMS.cols];
  if (!lines.every((line) => distinct(line.map((i) => grid[i])))) return null;
  return { grid, params: { right: T.text, down: U.text } };
}

const PATTERNS = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]];

/** Each slot picks its own system and is on or off along each line of it. */
function ownLines(attr, rng) {
  const used = rng.sample(range(0, attr.size - 1), rng.int(3, Math.min(attr.size, 6)));
  const systems = used.map(() => rng.pick(Object.keys(SYSTEMS)));
  if (new Set(systems).size < 2) return null;
  const grid = Array(9).fill(0);
  used.forEach((slot, k) => {
    const on = rng.pick(PATTERNS);
    SYSTEMS[systems[k]].forEach((line, j) => on[j] && line.forEach((cell) => (grid[cell] |= 1 << slot)));
  });
  return grid.every(Boolean) ? { grid, params: {} } : null;
}

/** Cell = (part fixed by the row) ∪ (part fixed by the column), from disjoint pools. */
function overlay(attr, rng) {
  const slots = rng.shuffle(range(0, attr.size - 1));
  const p = rng.int(2, attr.size - 2);
  const q = rng.int(2, attr.size - p);
  const subsets = (pool) =>
    retry(() => {
      const v = range(0, 2).map(() => maskOf(rng.sample(pool, rng.int(1, pool.length))));
      return distinct(v) ? v : null;
    });
  const across = subsets(slots.slice(0, p));
  const down = subsets(slots.slice(p, p + q));
  if (!across || !down) return null;
  return { grid: gridOf((r, c) => across[r] | down[c]), params: {} };
}

export const RULES = [
  {
    id: 'constant',
    score: 0,
    applies: () => true,
    make: (attr, rng) => ({ grid: Array(9).fill(pickValue(attr, rng)), params: {} }),
    explain: (attr) => `The ${thing(attr)} never changes.`,
  },
  {
    id: 'rows',
    score: 0.75,
    applies: hasThree,
    make: constantLines('rows'),
    explain: (attr) => `Each row keeps one ${thing(attr)}.`,
  },
  {
    id: 'cols',
    score: 0.75,
    applies: hasThree,
    make: constantLines('cols'),
    explain: (attr) => `Each column keeps one ${thing(attr)}.`,
  },
  {
    id: 'latinDown',
    score: 1.5,
    applies: hasThree,
    make: latin(-1),
    explain: (attr) => `Every row and column has the same three ${things(attr)}, and matching ones line up along ↘ diagonals.`,
  },
  {
    id: 'latinUp',
    score: 1.5,
    applies: hasThree,
    make: latin(1),
    explain: (attr) => `Every row and column has the same three ${things(attr)}, and matching ones line up along ↙ diagonals.`,
  },
  ...[false, true].map((wide) => ({
    id: wide ? 'progressionWide' : 'progression',
    score: wide ? 2.25 : 2,
    applies: canProgress(wide),
    make: (attr, rng) => progression(attr, rng, wide),
    explain: (attr, { s, t }) =>
      `The ${attr.noun ?? attr.label} ${stepText(attr, s)} with each step right and ${stepText(attr, t)} with each step down.`,
  })),
  {
    id: 'sum',
    score: 3.5,
    ...arithmetic((x, y) => x + y),
    explain: (attr, { dir }) => `In each ${LINE[dir]}, the ${attr.label} in the third picture is the first plus the second.`,
  },
  {
    id: 'difference',
    score: 3.5,
    ...arithmetic((x, y) => x - y),
    explain: (attr, { dir }) => `In each ${LINE[dir]}, the ${attr.label} in the third picture is the first minus the second.`,
  },
  ...Object.entries(SET_OPS).map(setOp),
  {
    id: 'partition',
    score: 5,
    applies: isSet(3),
    make: partition(false),
    explain: (attr, { dir }) => `Across each ${LINE[dir]}, each of the ${attr.label} shows up in exactly one of the three pictures.`,
  },
  {
    id: 'complement',
    score: 5.5,
    applies: isSet(3),
    make: partition(true),
    explain: (attr, { dir }) => `Across each ${LINE[dir]}, each of the ${attr.label} shows up in exactly two of the three pictures.`,
  },
  {
    id: 'move',
    score: 2.5,
    applies: (attr) => attr.kind === 'set' && attr.geometry?.motions.length > 0,
    make: move,
    explain: (attr, { right, down }) => `Moving right, the ${attr.label} ${right}. Moving down, they ${down}.`,
  },
  {
    id: 'ownLines',
    score: 5.5,
    applies: isSet(4),
    make: ownLines,
    explain: (attr) =>
      `Each of the ${attr.label} picks its own direction (rows, columns, or one of the diagonals) and along those lines appears in all three pictures or in none.`,
  },
  {
    id: 'overlay',
    score: 1.5,
    applies: isSet(4),
    make: overlay,
    explain: (attr) => `Each picture's ${attr.label} combine a group set by its row with a separate group set by its column.`,
  },
];
