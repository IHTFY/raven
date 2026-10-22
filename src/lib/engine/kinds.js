/**
 * Attribute kinds. Every figure is described by a few attributes, and an
 * attribute's kind decides which rules can drive it and which hypotheses
 * the solver tries on it.
 *
 * - category: unordered values (which shape)
 * - ordinal: ordered values with no arithmetic (shading, size)
 * - quantity: counts, which can be added and subtracted
 * - cyclic: steps around a circle (direction, in fixed degrees per step)
 * - set: a bitmask over slots (which tiles are black), with symmetries
 */

export const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

const popcount = (mask) => {
  let n = 0;
  for (let m = mask; m; m &= m - 1) n++;
  return n;
};

export const category = (name, label, names) => ({ name, label, kind: 'category', names, size: names.length });

export const ordinal = (name, label, names) => ({ name, label, kind: 'ordinal', names, size: names.length });

export const quantity = (name, label, min, max) => ({ name, label, kind: 'quantity', min, max });

export const cyclic = (name, label, size) => ({ name, label, kind: 'cyclic', size, degrees: 360 / size });

/**
 * `density` bounds how many slots a generated mask uses. Every set is also
 * seen as the number of its slots, so a puzzle is rejected when the counts
 * alone suggest a different answer.
 */
export const set = (name, label, size, { geometry = null, density = [1, Math.ceil(size / 2)] } = {}) => ({
  name,
  label,
  kind: 'set',
  size,
  geometry,
  density,
  projection: { of: popcount, attr: quantity(`${name}Count`, `number of ${label}`, 0, size) },
});

export const isNumeric = (attr) => attr.kind === 'ordinal' || attr.kind === 'quantity' || attr.kind === 'cyclic';

/** Values a generated puzzle may use. Sets are never empty. */
export function values(attr) {
  switch (attr.kind) {
    case 'quantity':
      return range(attr.min, attr.max);
    case 'set':
      return range(1, (1 << attr.size) - 1);
    default:
      return range(0, attr.size - 1);
  }
}

/**
 * Values the solver considers for the missing cell. Wider than `values`, so
 * a rule that predicts an impossible picture (eleven dots, an empty board)
 * still counts as a competing explanation.
 */
export function solverValues(attr) {
  switch (attr.kind) {
    case 'quantity':
      return range(0, 2 * attr.max);
    case 'set':
      return range(0, (1 << attr.size) - 1);
    default:
      return values(attr);
  }
}

export const mod = (a, n) => ((a % n) + n) % n;

/** The group operation's difference: a − b, wrapped for cyclic, XOR for sets. */
export function difference(attr) {
  if (attr.kind === 'cyclic') return (a, b) => mod(a - b, attr.size);
  if (attr.kind === 'set') return (a, b) => a ^ b;
  return (a, b) => a - b;
}

export function plus(attr) {
  if (attr.kind === 'cyclic') return (a, b) => mod(a + b, attr.size);
  return (a, b) => a + b;
}

/** "turns 90° clockwise", "goes up by 2". */
export function stepText(attr, step) {
  if (attr.kind === 'cyclic') {
    let degrees = mod(step * attr.degrees, 360);
    if (degrees > 180) degrees -= 360;
    if (degrees === 180) return 'turns 180°';
    return `turns ${Math.abs(degrees)}° ${degrees > 0 ? 'clockwise' : 'counterclockwise'}`;
  }
  return step > 0 ? `goes up by ${step}` : `goes down by ${-step}`;
}
