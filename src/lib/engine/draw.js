/**
 * Figures are lists of primitives in a 100×100 box: polygons, open lines and
 * circles, each with a fill and stroke color name (ink, paper, mid, none).
 * The CSS maps those names to theme colors.
 *
 * A figure's key ignores drawing order and vertex order, so two figures with
 * the same key look the same. Keys check that answer options differ.
 */

export const INK = 'ink';
export const PAPER = 'paper';
export const MID = 'mid';
export const NONE = 'none';
const STROKE = 3;

export const poly = (pts, fill = INK, width = STROKE, stroke = INK) => ({ type: 'poly', pts, fill, stroke, width });
export const line = (pts, width = STROKE) => ({ type: 'line', pts, fill: NONE, stroke: INK, width });
export const circle = (x, y, r, fill = INK, width = 0) => ({
  type: 'circle',
  pts: [[x, y]],
  r,
  fill,
  stroke: width ? INK : NONE,
  width,
});

/** Vertices of a regular polygon, starting at `start` degrees (−90 is straight up). */
export const regular = (n, r, cx = 50, cy = 50, start = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 * i) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

export const star = (r, cx = 50, cy = 50) =>
  regular(10, r, cx, cy).map(([x, y], i) => (i % 2 ? [cx + (x - cx) * 0.45, cy + (y - cy) * 0.45] : [x, y]));

/** Points along a circular arc, clockwise from `from` to `to` degrees. */
export const arc = (cx, cy, r, from, to, steps = 16) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / steps) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

/**
 * Basic shapes sized to look about equally big at the same `size`, centered
 * on their bounding box.
 */
const SHAPES = {
  circle: (s, x, y) => ({ circle: [x, y, s * 0.92] }),
  triangle: (s, x, y) => regular(3, s * 1.18, x, y + s * 0.3),
  square: (s, x, y) => regular(4, s * 1.1, x, y, -45),
  diamond: (s, x, y) => regular(4, s * 1.12, x, y),
  pentagon: (s, x, y) => regular(5, s * 1.02, x, y + s * 0.1),
  hexagon: (s, x, y) => regular(6, s, x, y, 0),
  star: (s, x, y) => star(s * 1.14, x, y + s * 0.11),
  cross: (s, x, y) => {
    const a = s * 0.85;
    const b = s * 0.3;
    return [[-b, -a], [b, -a], [b, -b], [a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b], [-a, b], [-a, -b], [-b, -b]].map(
      ([dx, dy]) => [x + dx, y + dy],
    );
  },
};

export function shape(name, size, fill, { x = 50, y = 50, width = STROKE } = {}) {
  const geometry = SHAPES[name](size, x, y);
  return geometry.circle ? circle(...geometry.circle, fill, width) : poly(geometry, fill, width);
}

const turn = (degrees, cx, cy) => {
  const a = (degrees * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return ([x, y]) => [cx + (x - cx) * cos - (y - cy) * sin, cy + (x - cx) * sin + (y - cy) * cos];
};

/** Rotate primitives clockwise about a point. */
export const rotate = (prims, degrees, cx = 50, cy = 50) =>
  prims.map((p) => ({ ...p, pts: p.pts.map(turn(degrees, cx, cy)) }));

const num = (v) => String(Math.round(v * 100) / 100);
const xy = ([x, y]) => `${num(x)} ${num(y)}`;

function toPath(p) {
  if (p.type === 'circle') {
    const [x, y] = p.pts[0];
    return `M${num(x - p.r)} ${num(y)}a${num(p.r)} ${num(p.r)} 0 1 0 ${num(2 * p.r)} 0a${num(p.r)} ${num(p.r)} 0 1 0 ${num(-2 * p.r)} 0Z`;
  }
  return `M${p.pts.map(xy).join('L')}${p.type === 'poly' ? 'Z' : ''}`;
}

const canon = (v) => (Math.round(v * 10 + 1e-6) / 10).toFixed(1);

/** A key for what a figure looks like, independent of drawing and vertex order. */
export function figureKey(prims) {
  return prims
    .map((p) => [p.type, p.fill, p.stroke, p.width, p.r ?? '', p.pts.map(([x, y]) => `${canon(x)},${canon(y)}`).sort().join(' ')].join('/'))
    .sort()
    .join('|');
}

/** What the UI draws: SVG paths. */
export const figure = (prims) => ({
  paths: prims.map((p) => ({ d: toPath(p), fill: p.fill, stroke: p.stroke, width: p.width })),
});
