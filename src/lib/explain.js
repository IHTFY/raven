/**
 * Demos that show a puzzle's rules instead of only telling them. Each rule
 * becomes a few steps for Demo.svelte to play: lines lighting up in a small
 * grid, arrows between neighbors, or a strip where two pictures combine
 * into the third.
 *
 * Pictures are redrawn with only the rule's attribute changing: other
 * attributes keep the answer's value and other sets are left empty, so a
 * demo shows one thing at a time. Parts of a set can be tinted by where
 * they come from (tone a, b, c, or both), and a step can drop parts, fade
 * new ones in, or move a picture onto its neighbor.
 */

import { figure, figureKey } from './engine/draw.js';
import { FAMILIES } from './engine/families/index.js';
import { SYSTEMS } from './engine/grid.js';
import { mod, range, stepText } from './engine/kinds.js';

const FAMILY = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
const LINE = { rows: 'Row', cols: 'Column', down: '↘ diagonal', up: '↙ diagonal' };
const LINES = { rows: 'rows', cols: 'columns', down: '↘ diagonals', up: '↙ diagonals' };

/** The cells with every attribute but `name` held still. */
function isolate(family, cells, name) {
  const answer = cells[8];
  return cells.map((cell) => {
    const out = Object.fromEntries(
      family.attrs.map((a) => [a.name, a.name === name ? cell[name] : a.kind === 'set' ? 0 : answer[a.name]]),
    );
    // Holding an attribute still can break a family's own rule (clock hands on top of each other).
    return !family.valid || family.valid(out) ? out : cell;
  });
}

/** How to draw one attribute: whole pictures, or for sets, a fixed background plus parts by mask. */
function painter(family, attr, iso) {
  if (attr.kind !== 'set') {
    const figures = iso.map((cell) => figure(family.render(cell)));
    return { base: null, cell: (i) => [{ figure: figures[i] }] };
  }
  const at = (mask) => family.render({ ...iso[8], [attr.name]: mask });
  const background = new Set(at(0).map((p) => figureKey([p])));
  const parts = (mask) => figure(at(mask).filter((p) => !background.has(figureKey([p]))));
  return {
    base: figure(at(0)),
    parts,
    cell: (i) => [{ figure: parts(iso[i][attr.name]) }],
  };
}

const short = (attr, step) => {
  if (attr.kind !== 'cyclic') return step > 0 ? `+${step}` : `−${-step}`;
  let degrees = mod(step * attr.degrees, 360);
  if (degrees > 180) degrees -= 360;
  return degrees === 180 ? '180°' : `${degrees > 0 ? '↻' : '↺'}${Math.abs(degrees)}°`;
};

/** The same picture across a line: light up each line of a system in turn. */
function lines(system, attr, paint) {
  const cells = range(0, 8).map(paint.cell);
  const same = attr.kind === 'set' ? 'arrangement' : attr.label;
  return {
    kind: 'grid',
    base: paint.base,
    steps: SYSTEMS[system].map((mark, k) => ({ cells, mark, caption: `${LINE[system]} ${k + 1}: the same ${same}` })),
  };
}

const PAIRS = [
  [0, 1, 'right'],
  [1, 2, 'right'],
  [0, 3, 'down'],
  [3, 6, 'down'],
  [7, 8, 'right'],
  [5, 8, 'down'],
];

/** A progression: one arrow at a time, labelled with its step. */
function steps(attr, paint, { s, t }) {
  const cells = range(0, 8).map(paint.cell);
  return {
    kind: 'grid',
    base: paint.base,
    steps: PAIRS.map(([from, to, dir]) => {
      const step = dir === 'right' ? s : t;
      return {
        cells,
        mark: [from, to],
        arrow: { from, to, label: short(attr, step) },
        caption: `Going ${dir}, the ${attr.noun ?? attr.label} ${stepText(attr, step)}`,
      };
    }),
  };
}

const sign = (text) => ({ sign: text });

/** Sum or difference of quantities: the numbers under each picture. */
function arithmetic(attr, paint, iso, { dir }, op) {
  return {
    kind: 'strip',
    base: paint.base,
    steps: SYSTEMS[dir].map(([i, j, k], n) => {
      const [a, b, c] = [i, j, k].map((x) => iso[x][attr.name]);
      return {
        items: [
          { layers: paint.cell(i), label: a },
          sign(op),
          { layers: paint.cell(j), label: b },
          sign('='),
          { layers: paint.cell(k).map((l) => ({ ...l, reveal: true })), label: c, reveal: true },
        ],
        caption: `${LINE[dir]} ${n + 1}: ${a} ${op} ${b} = ${c}`,
      };
    }),
  };
}

/** Which parts of a ∘ b each set operation keeps, by where they come from. */
const KEEPS = {
  or: { onlyA: true, onlyB: true, both: true, sign: '+', caption: 'everything from both' },
  and: { onlyA: false, onlyB: false, both: true, sign: '∩', caption: 'only what both share' },
  xor: { onlyA: true, onlyB: true, both: false, sign: '⊕', caption: 'shared parts cancel out' },
  minus: { onlyA: true, onlyB: false, both: false, sign: '−', caption: 'the first, minus what the second has' },
  rminus: { onlyA: false, onlyB: true, both: false, sign: '−', caption: 'the second, minus what the first has' },
};

/** Two pictures slide together; parts from each are tinted, and the ones the rule drops fade away. */
function setOp(id, attr, paint, iso, { dir }) {
  const keep = KEEPS[id];
  return {
    kind: 'strip',
    base: paint.base,
    steps: SYSTEMS[dir].map(([i, j, k], n) => {
      const [a, b] = [i, j].map((x) => iso[x][attr.name]);
      const merged = [
        { figure: paint.parts(a & ~b), tone: 'a', drop: !keep.onlyA, mask: a & ~b },
        { figure: paint.parts(b & ~a), tone: 'b', drop: !keep.onlyB, mask: b & ~a },
        { figure: paint.parts(a & b), tone: 'both', drop: !keep.both, mask: a & b },
      ];
      const first = { layers: [{ figure: paint.parts(a), tone: 'a' }] };
      const second = { layers: [{ figure: paint.parts(b), tone: 'b' }] };
      return {
        items: [
          ...(id === 'rminus' ? [second, sign(keep.sign), first] : [first, sign(keep.sign), second]),
          sign('='),
          { layers: merged, merge: true, result: iso[k][attr.name] },
        ],
        caption: `${LINE[dir]} ${n + 1}: ${keep.caption}`,
      };
    }),
  };
}

/** A partition: each picture's parts in its own tone add up to the whole group. Complement: what each one leaves out. */
function split(complement, attr, paint, iso, { dir }) {
  const tones = ['a', 'b', 'c'];
  return {
    kind: 'strip',
    base: paint.base,
    steps: SYSTEMS[dir].map((line, n) => {
      const masks = line.map((x) => iso[x][attr.name]);
      const whole = masks.reduce((m, x) => m | x);
      const shown = masks.map((m) => (complement ? whole & ~m : m));
      const items = line.flatMap((_, k) => [
        ...(k ? [sign('+')] : []),
        {
          layers: complement
            ? [{ figure: paint.parts(masks[k]) }, { figure: paint.parts(shown[k]), tone: tones[k], ghost: true }]
            : [{ figure: paint.parts(masks[k]), tone: tones[k] }],
        },
      ]);
      return {
        items: [
          ...items,
          sign('='),
          { layers: shown.map((m, k) => ({ figure: paint.parts(m), tone: tones[k], mask: m })), merge: true, result: whole },
        ],
        caption: complement
          ? `${LINE[dir]} ${n + 1}: each part is missing from exactly one picture`
          : `${LINE[dir]} ${n + 1}: each part is in exactly one picture`,
      };
    }),
  };
}

/** How a motion looks: a turn in degrees, or a shift in percent of the picture, wrapped the short way. */
export function motionOf(name, cellSize = 24) {
  const turn = /^turn(\d+)$/.exec(name);
  if (turn) {
    const degrees = Number(turn[1]);
    return { rotate: degrees > 180 ? degrees - 360 : degrees, dx: 0, dy: 0 };
  }
  const shift = /^shift(\d)(\d)$/.exec(name);
  if (!shift) return null;
  const short = (d) => (d <= 1 ? d : d - 3);
  return { rotate: 0, dx: short(Number(shift[2])) * cellSize, dy: short(Number(shift[1])) * cellSize };
}

/** A picture turns or slides onto its neighbor. */
function move(attr, paint, iso, params) {
  const motion = { right: motionOf(params.rightName), down: motionOf(params.downName) };
  return {
    kind: 'strip',
    base: paint.base,
    steps: PAIRS.slice(0, 5).map(([from, to, dir]) => ({
      items: [
        { layers: paint.cell(from) },
        sign(dir === 'right' ? '→' : '↓'),
        {
          layers: [
            { figure: paint.parts(iso[from][attr.name]), move: motion[dir] },
            { figure: paint.parts(iso[to][attr.name]), reveal: true },
          ],
        },
      ],
      caption: `Going ${dir}, the ${attr.label} ${dir === 'right' ? params.right : params.down}`,
    })),
  };
}

/** Row groups and column groups laid over each other, tinted apart. */
function overlay(attr, paint, iso, { across, down }) {
  const cellsFor = (tinted) =>
    range(0, 8).map((i) => {
      const [r, c] = [Math.floor(i / 3), i % 3];
      return [
        { figure: paint.parts(across[r]), tone: tinted === 'rows' ? 'a' : undefined },
        { figure: paint.parts(down[c]), tone: tinted === 'cols' ? 'b' : undefined },
      ];
    });
  const rows = cellsFor('rows');
  const cols = cellsFor('cols');
  return {
    kind: 'grid',
    base: paint.base,
    steps: [
      ...SYSTEMS.rows.map((mark, k) => ({ cells: rows, mark, caption: `Row ${k + 1} adds the same group to each picture` })),
      ...SYSTEMS.cols.map((mark, k) => ({ cells: cols, mark, caption: `Column ${k + 1} adds a group of its own` })),
    ],
  };
}

/** Each part in turn, with the lines it follows. */
function ownLines(attr, paint, iso, { slots, systems }) {
  return {
    kind: 'grid',
    base: paint.base,
    steps: slots.map((slot, k) => {
      const bit = 1 << slot;
      const mark = range(0, 8).filter((i) => iso[i][attr.name] & bit);
      return {
        cells: range(0, 8).map((i) => [
          { figure: paint.parts(iso[i][attr.name] & ~bit) },
          { figure: paint.parts(iso[i][attr.name] & bit), tone: 'a' },
        ]),
        mark,
        caption: `This one follows the ${LINES[systems[k]]}: all three pictures of a line, or none`,
      };
    }),
  };
}

/** A demo for one of a puzzle's rules (an entry of `puzzle.rules`), or null if it has none. */
export function demoOf(puzzle, rule) {
  const family = FAMILY[puzzle.family];
  const attr = family?.attrs.find((a) => a.name === rule.attr);
  if (!attr || !rule.params) return null;
  const iso = isolate(family, puzzle.cells, attr.name);
  const paint = painter(family, attr, iso);
  const p = rule.params;
  switch (rule.rule) {
    case 'rows':
    case 'cols':
      return lines(rule.rule, attr, paint);
    case 'latinDown':
      return lines('down', attr, paint);
    case 'latinUp':
      return lines('up', attr, paint);
    case 'progression':
    case 'progressionWide':
      return steps(attr, paint, p);
    case 'sum':
      return arithmetic(attr, paint, iso, p, '+');
    case 'difference':
      return arithmetic(attr, paint, iso, p, '−');
    case 'xor':
    case 'or':
    case 'and':
    case 'minus':
    case 'rminus':
      return setOp(rule.rule, attr, paint, iso, p);
    case 'partition':
      return split(false, attr, paint, iso, p);
    case 'complement':
      return split(true, attr, paint, iso, p);
    case 'move':
      return motionOf(p.rightName) && motionOf(p.downName) ? move(attr, paint, iso, p) : null;
    case 'overlay':
      return overlay(attr, paint, iso, p);
    case 'ownLines':
      return ownLines(attr, paint, iso, p);
    default:
      return null;
  }
}
