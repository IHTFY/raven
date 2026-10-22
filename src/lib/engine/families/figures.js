/**
 * Families built from whole shapes: one shape, a group of shapes, two
 * counts on either side of a line, and a shape inside a shape.
 */

import { INK, MID, NONE, PAPER, circle, line, shape } from '../draw.js';
import { category, ordinal, quantity } from '../kinds.js';

export const FILLS = [PAPER, MID, INK];
export const shading = (name, label = 'shading') => ({ ...ordinal(name, label, ['hollow', 'gray', 'solid']), plural: `${label}s` });

const SHAPE_NAMES = ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'star'];
const SIDES = { triangle: 3, square: 4, pentagon: 5, hexagon: 6 };

export const shapes = {
  id: 'shapes',
  group: 'shapes',
  name: 'Shapes',
  base: 0,
  attrs: [
    {
      ...category('shape', 'shape', SHAPE_NAMES),
      // People count sides, so the side counts must not hint at another answer.
      projection: { of: (v) => SIDES[SHAPE_NAMES[v]] ?? null, attr: quantity('sides', 'number of sides', 0, 6) },
    },
    shading('fill'),
    ordinal('size', 'size', ['small', 'medium', 'large']),
  ],
  render: (c) => [shape(SHAPE_NAMES[c.shape], [16, 26, 36][c.size], FILLS[c.fill])],
};

const ITEMS = ['circle', 'square', 'triangle', 'diamond'];
const SPOTS = [24, 50, 76].flatMap((y) => [24, 50, 76].map((x) => [x, y]));
// Dice-style layouts, as indexes into the 3×3 spots.
const LAYOUTS = [[], [4], [2, 6], [2, 4, 6], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8], [0, 2, 3, 4, 5, 6, 8], [0, 1, 2, 3, 5, 6, 7, 8], [0, 1, 2, 3, 4, 5, 6, 7, 8]];

export const counts = {
  id: 'counts',
  group: 'counts',
  name: 'Counting',
  base: 0.5,
  attrs: [
    quantity('count', 'number of shapes', 1, 9),
    { ...category('item', 'shape', ITEMS) },
    shading('fill'),
  ],
  render: (c) =>
    LAYOUTS[c.count].map((i) => shape(ITEMS[c.item], 10, FILLS[c.fill], { x: SPOTS[i][0], y: SPOTS[i][1], width: 2.5 })),
};

const spaced = (n, gap = 12) => Array.from({ length: n }, (_, i) => 50 + (i - (n - 1) / 2) * gap);

export const tally = {
  id: 'tally',
  group: 'tally',
  name: 'Tally',
  base: 0.5,
  attrs: [quantity('top', 'number of bars above the line', 1, 5), quantity('bottom', 'number of dots below the line', 1, 5)],
  render: (c) => [
    line([[12, 50], [88, 50]]),
    ...spaced(c.top).map((x) => line([[x, 20], [x, 40]], 3.5)),
    ...spaced(c.bottom).map((x) => circle(x, 68, 4.5)),
  ],
};

const OUTER = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
const INNER = ['circle', 'square', 'triangle', 'diamond', 'cross'];

export const nested = {
  id: 'nested',
  group: 'nested',
  name: 'Nested shapes',
  base: 0.5,
  attrs: [category('outer', 'outer shape', OUTER), category('inner', 'inner shape', INNER), shading('innerFill', 'inner shading')],
  render: (c) => {
    const outer = OUTER[c.outer];
    // A triangle's middle sits lower than its bounding box's middle.
    const y = outer === 'triangle' ? 61 : 50;
    return [shape(outer, 38, NONE), shape(INNER[c.inner], 11, FILLS[c.innerFill], { y, width: 2.5 })];
  },
};
