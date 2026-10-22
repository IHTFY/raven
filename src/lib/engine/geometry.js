/**
 * Symmetries of a set attribute's slots. A transform permutes the slots
 * (perm[i] is where slot i goes) and maps a mask through a lookup table.
 * The solver tries every transform; the generator only moves figures with
 * the ones listed as motions.
 */

import { range } from './kinds.js';

function transform(name, text, perm) {
  const table = new Uint16Array(1 << perm.length);
  for (let mask = 0; mask < table.length; mask++) {
    for (let i = 0; i < perm.length; i++) if ((mask >> i) & 1) table[mask] |= 1 << perm[i];
  }
  return { name, text, perm, apply: (mask) => table[mask] };
}

const compose = (t, u) => t.perm.map((i) => u.perm[i]);
export const commute = (t, u) => compose(t, u).every((v, i) => v === compose(u, t)[i]);

const C = 50;
const round = (v) => Math.round(v * 100) / 100;

/** Rotation about the center, clockwise on screen (y points down). */
const rotation = (degrees) => {
  const a = (degrees * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return ([x, y]) => [round(C + (x - C) * cos - (y - C) * sin), round(C + (x - C) * sin + (y - C) * cos)];
};

/** Mirror across the line through the center at `degrees` clockwise from horizontal. */
const reflection = (degrees) => {
  const a = (2 * degrees * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return ([x, y]) => [round(C + (x - C) * cos + (y - C) * sin), round(C + (x - C) * sin - (y - C) * cos)];
};

const pointKey = (points) => points.map(([x, y]) => `${round(x)},${round(y)}`).sort().join(' ');

/**
 * Keep the point maps that send every slot (a list of points) onto a slot,
 * and turn each into a transform.
 */
function fromPoints(slots, maps) {
  const keys = slots.map(pointKey);
  return maps.flatMap(({ name, text, map }) => {
    const perm = slots.map((points) => keys.indexOf(pointKey(points.map(map))));
    return perm.includes(-1) ? [] : [transform(name, text, perm)];
  });
}

const turnText = (degrees) =>
  degrees === 180 ? 'turn 180°' : degrees < 180 ? `turn ${degrees}° clockwise` : `turn ${360 - degrees}° counterclockwise`;

const turns = (step) =>
  range(1, 360 / step - 1).map((k) => ({ name: `turn${k * step}`, text: turnText(k * step), map: rotation(k * step) }));

const SQUARE_MIRRORS = [
  { name: 'flipH', text: 'flip left to right', map: reflection(90) },
  { name: 'flipV', text: 'flip top to bottom', map: reflection(0) },
  { name: 'flipDown', text: 'flip across the ↘ diagonal', map: reflection(45) },
  { name: 'flipUp', text: 'flip across the ↙ diagonal', map: reflection(135) },
];

/** Symmetries of a square: quarter turns and four mirrors. */
export const squareSymmetries = (slots) => fromPoints(slots, [...turns(90), ...SQUARE_MIRRORS]);

/** Symmetries of an octagon: eighth turns and eight mirrors. */
export const octagonSymmetries = (slots) =>
  fromPoints(slots, [
    ...turns(45),
    ...range(0, 7).map((k) => ({ name: `flip${k}`, text: 'flip across an axis', map: reflection(k * 22.5) })),
  ]);

const shiftText = (dr, dc, k) => {
  const steps = (n) => (n === 1 ? 'one square' : `${n} squares`);
  const part = (d, ahead, back) => (d === 0 ? [] : d <= k / 2 ? [`${steps(d)} ${ahead}`] : [`${steps(k - d)} ${back}`]);
  return `move ${[...part(dc, 'right', 'left'), ...part(dr, 'down', 'up')].join(' and ')} (wrapping around)`;
};

/** A k×k board: wrapped shifts, quarter turns and mirrors. Slot = k·row + column. */
export function board(k, cellCenter) {
  const cells = range(0, k * k - 1);
  const shifts = range(0, k - 1).flatMap((dr) =>
    range(0, k - 1)
      .filter((dc) => dr || dc)
      .map((dc) =>
        transform(
          `shift${dr}${dc}`,
          shiftText(dr, dc, k),
          cells.map((i) => ((Math.floor(i / k) + dr) % k) * k + ((i % k) + dc) % k),
        ),
      ),
  );
  return [...shifts, ...squareSymmetries(cells.map((i) => [cellCenter(i)]))];
}
