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

export const sets = [tiles, marks, lines, spokes, parts];
