/**
 * Families that point somewhere: a glyph turned in 45° steps, plus one more
 * attribute. No glyph looks the same after any turn, so every direction
 * reads unambiguously.
 */

import { INK, NONE, PAPER, arc, circle, line, poly, rotate } from '../draw.js';
import { category, cyclic, ordinal, quantity } from '../kinds.js';
import { FILLS, shading } from './figures.js';

const pointer = (id, name, noun, second, draw) => ({
  id,
  group: 'pointer',
  name,
  base: 1,
  attrs: [{ ...cyclic('dir', 'direction', 8), noun }, second],
  render: (c) => rotate(draw(c[second.name]), c.dir * 45),
});

const feather = (y) => line([[41, y + 8], [50, y], [59, y + 8]]);

const arrow = pointer(
  'arrow',
  'Arrows',
  'arrow',
  { ...category('tail', 'tail', ['plain', 'one feather', 'two feathers']) },
  (tail) => [
    line([[50, 84], [50, 24]]),
    poly([[50, 12], [60, 30], [40, 30]], INK, 0, NONE),
    ...[74, 64].slice(0, tail).map(feather),
  ],
);

const KITE = [[50, 12], [66, 40], [50, 88], [34, 40]];

const kite = pointer(
  'kite',
  'Kites',
  'kite',
  { ...category('half', 'shaded half', ['none', 'left', 'right']), plural: 'shaded halves' },
  (half) => [
    poly(KITE, PAPER),
    ...(half ? [poly(half === 1 ? [KITE[0], KITE[3], KITE[2]] : [KITE[0], KITE[1], KITE[2]], INK)] : []),
  ],
);

const chevron = pointer(
  'chevron',
  'Chevrons',
  'chevron',
  quantity('dots', 'number of dots', 1, 3),
  (dots) => [line([[24, 56], [50, 28], [76, 56]], 5), ...[48, 60, 72].slice(0, dots).map((y) => circle(50, y, 4.5))],
);

const umbrella = pointer('umbrella', 'Umbrellas', 'umbrella', shading('fill'), (fill) => [
  line([[50, 48], [50, 76], ...arc(44, 76, 6, 0, 180, 8)]),
  poly(arc(50, 48, 30, 180, 360), FILLS[fill]),
]);

const vee = pointer('vee', 'Angles', 'V', ordinal('angle', 'angle', ['narrow', 'right', 'wide']), (angle) => {
  const half = ([40, 90, 140][angle] / 2) * (Math.PI / 180);
  const dx = 44 * Math.sin(half);
  const dy = 44 * Math.cos(half);
  return [line([[50 - dx, 70 - dy], [50, 70], [50 + dx, 70 - dy]]), circle(50, 70, 5)];
});

const hand = (dir, length, width) => rotate([line([[50, 50], [50, 50 - length]], width)], dir * 45);

const clock = {
  id: 'clock',
  group: 'pointer',
  name: 'Clocks',
  base: 1.5,
  attrs: [
    { ...cyclic('hour', 'short-hand direction', 8), noun: 'short hand' },
    { ...cyclic('minute', 'long-hand direction', 8), noun: 'long hand' },
  ],
  // Overlapping hands would hide one of them.
  valid: (c) => c.hour !== c.minute,
  render: (c) => [circle(50, 50, 41, NONE, 2.5), ...hand(c.minute, 33, 2.5), ...hand(c.hour, 21, 5.5), circle(50, 50, 4)],
};

export const pointers = [arrow, kite, chevron, umbrella, vee, clock];
