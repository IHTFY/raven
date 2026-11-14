/**
 * Families where each picture shows a subset of fixed slots: squares on a
 * board, lines on a square, spokes around a hub, parts of a target.
 */

import { INK, NONE, circle, line, poly, regular } from '../draw.js';
import { board, octagonSymmetries, squareSymmetries } from '../geometry.js';
import { range, set } from '../kinds.js';

const has = (mask, i) => (mask >> i) & 1;

const EDGE = 14;
const CELL = 24;
const corner = (i) => [EDGE + CELL * (i % 3), EDGE + CELL * Math.floor(i / 3)];
const center = (i) => corner(i).map((v) => v + CELL / 2);
const square = ([x, y], half) => [[x - half, y - half], [x + half, y - half], [x + half, y + half], [x - half, y + half]];

const boardLines = [
  poly(square([50, 50], 36), NONE, 2),
  ...[EDGE + CELL, EDGE + 2 * CELL].flatMap((v) => [line([[v, EDGE], [v, 100 - EDGE]], 1.5), line([[EDGE, v], [100 - EDGE, v]], 1.5)]),
];

const boardGeometry = {
  transforms: board(3, center),
  motions: ['shift01', 'shift02', 'shift10', 'shift20', 'turn90', 'turn270'],
};

export const tiles = {
  id: 'tiles',
  group: 'tiles',
  name: 'Tiles',
  base: 1,
  attrs: [set('tiles', 'filled squares', 9, { geometry: boardGeometry, density: [2, 4] })],
  render: (c) => [...boardLines, ...range(0, 8).filter((i) => has(c.tiles, i)).map((i) => poly(square(center(i), 9), INK, 0, NONE))],
};

export const marks = {
  id: 'marks',
  group: 'marks',
  name: 'Marks',
  base: 1.5,
  attrs: [
    set('boxes', 'squares', 9, { geometry: boardGeometry, density: [1, 4] }),
    set('dots', 'dots', 9, { geometry: boardGeometry, density: [1, 4] }),
  ],
  render: (c) => [
    ...boardLines,
    ...range(0, 8).flatMap((i) => [
      ...(has(c.boxes, i) ? [poly(square(center(i), 7.5), NONE, 2.5)] : []),
      ...(has(c.dots, i) ? [circle(...center(i), 3.5)] : []),
    ]),
  ],
};

const [A, M, B] = [18, 50, 82];
const SEGMENTS = [
  [[A, A], [B, A]],
  [[B, A], [B, B]],
  [[A, B], [B, B]],
  [[A, A], [A, B]],
  [[A, A], [B, B]],
  [[B, A], [A, B]],
  [[M, A], [M, B]],
  [[A, M], [B, M]],
];

export const lines = {
  id: 'lines',
  group: 'lines',
  name: 'Lines',
  base: 1,
  attrs: [
    set('segments', 'lines', 8, {
      geometry: { transforms: squareSymmetries(SEGMENTS), motions: ['turn90', 'turn270'] },
      density: [2, 4],
    }),
  ],
  render: (c) => [
    ...[[A, A], [B, A], [A, B], [B, B]].map(([x, y]) => circle(x, y, 2.5)),
    ...SEGMENTS.filter((_, i) => has(c.segments, i)).map((s) => line(s, 4)),
  ],
};

// Spoke k points k·45° clockwise from straight up.
const SPOKES = range(0, 7).map((k) => {
  const [x, y] = regular(8, 1, 0, 0)[k];
  return [[50 + 9 * x, 50 + 9 * y], [50 + 40 * x, 50 + 40 * y]];
});

export const spokes = {
  id: 'spokes',
  group: 'spokes',
  name: 'Spokes',
  base: 1,
  attrs: [
    set('spokes', 'spokes', 8, {
      geometry: {
        transforms: octagonSymmetries(SPOKES),
        motions: ['turn45', 'turn90', 'turn135', 'turn225', 'turn270', 'turn315'],
      },
      density: [2, 4],
    }),
  ],
  render: (c) => [circle(50, 50, 5), ...SPOKES.filter((_, i) => has(c.spokes, i)).map((s) => line(s, 4))],
};

// Parts that never touch, so each one stays recognizable in any combination.
const PARTS = [
  () => [circle(50, 50, 41, NONE, 3)],
  () => [poly(regular(4, 29), NONE)],
  () => [poly(square([50, 50], 12), NONE)],
  () => [circle(50, 50, 5)],
  () => [13, 87].flatMap((y) => [13, 87].map((x) => circle(x, y, 4.5))),
];

export const parts = {
  id: 'parts',
  group: 'parts',
  name: 'Parts',
  base: 0.5,
  attrs: [set('parts', 'parts', PARTS.length, { density: [1, 3] })],
  render: (c) => PARTS.flatMap((part, i) => (has(c.parts, i) ? part() : [])),
};

/** Twelve half-length segments joining the nine nodes of a lattice; `node(i)` places node i (row-major). */
function lattice(id, name, node) {
  const nodes = range(0, 8).map(node);
  const pairs = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8]];
  const segments = pairs.map(([a, b]) => [nodes[a], nodes[b]]);
  return {
    id,
    group: 'lattice',
    name,
    base: 1.5,
    attrs: [
      set('segments', 'lines', 12, {
        geometry: { transforms: squareSymmetries(segments), motions: ['turn90', 'turn270'] },
        density: [3, 6],
      }),
    ],
    render: (c) => [
      ...nodes.map(([x, y]) => circle(x, y, 2)),
      ...segments.filter((_, i) => has(c.segments, i)).map((s) => line(s, 4)),
    ],
  };
}

/** A square split into four, as in Mensa Norway item 21. */
export const grid = lattice('grid', 'Grid', (i) => [A + (M - A) * (i % 3), A + (M - A) * Math.floor(i / 3)]);

/** The same lattice stood on a corner, as in item 28. */
export const diamond = lattice('diamond', 'Diamond', (i) => {
  const [u, v] = [(i % 3) - 1, Math.floor(i / 3) - 1];
  return [50 + 21 * (u - v), 50 + 21 * (u + v)];
});

// Spoke k and dot k both point k·45° clockwise from straight up.
const AROUND = regular(8, 1, 0, 0);
const SHORT_SPOKES = AROUND.map(([x, y]) => [[50 + 8 * x, 50 + 8 * y], [50 + 28 * x, 50 + 28 * y]]);
const RIM_DOTS = AROUND.map(([x, y]) => [50 + 39 * x, 50 + 39 * y]);
const wheelGeometry = (slots) => ({
  transforms: octagonSymmetries(slots),
  motions: ['turn45', 'turn90', 'turn135', 'turn225', 'turn270', 'turn315'],
});

/** Spokes and rim dots, two sets in one picture, as in item 26. */
export const wheel = {
  id: 'wheel',
  group: 'wheel',
  name: 'Wheel',
  base: 1.5,
  attrs: [
    set('spokes', 'spokes', 8, { geometry: wheelGeometry(SHORT_SPOKES), density: [2, 4] }),
    set('rim', 'dots', 8, { geometry: wheelGeometry(RIM_DOTS.map((p) => [p])), density: [2, 4] }),
  ],
  render: (c) => [
    circle(50, 50, 4),
    ...SHORT_SPOKES.filter((_, i) => has(c.spokes, i)).map((s) => line(s, 4)),
    ...RIM_DOTS.filter((_, i) => has(c.rim, i)).map(([x, y]) => circle(x, y, 4)),
  ],
};

const BAR_X = [20, 40, 60, 80];
const ABOVE = BAR_X.map((x) => [x, 34]);
const BELOW = BAR_X.map((x) => [x, 66]);
const barGeometry = (slots) => ({ transforms: squareSymmetries(slots.map((p) => [p])), motions: [] });

/** A bar with dots above it and squares below, each set changing on its own, as in item 22. */
export const bar = {
  id: 'bar',
  group: 'bar',
  name: 'Bar',
  base: 1.5,
  attrs: [
    set('above', 'dots', 4, { geometry: barGeometry(ABOVE), density: [1, 3] }),
    set('below', 'squares', 4, { geometry: barGeometry(BELOW), density: [1, 3] }),
  ],
  render: (c) => [
    poly([[10, 48], [90, 48], [90, 52], [10, 52]], INK, 0, NONE),
    ...ABOVE.filter((_, i) => has(c.above, i)).map(([x, y]) => circle(x, y, 6)),
    ...BELOW.filter((_, i) => has(c.below, i)).map((p) => poly(square(p, 6), INK, 0, NONE)),
  ],
};

export const sets = [tiles, marks, lines, spokes, parts, grid, diamond, wheel, bar];
