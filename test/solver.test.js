import { describe, expect, it } from 'vitest';
import { FAMILIES } from '../src/lib/engine/families/index.js';
import { candidates, determined, explanations } from '../src/lib/engine/solver.js';
import { category, cyclic, quantity } from '../src/lib/engine/kinds.js';

const shape = category('shape', 'shape', ['a', 'b', 'c', 'd']);
const count = quantity('count', 'count', 1, 9);
const dir = cyclic('dir', 'direction', 8);
const tiles = FAMILIES.find((f) => f.id === 'tiles').attrs[0];

describe('solver', () => {
  it('solves a Latin square', () => {
    expect(candidates(shape, [0, 1, 2, 1, 2, 0, 2, 0, 1])).toEqual([1]);
  });

  it('solves a diagonal Latin square', () => {
    expect(candidates(shape, [0, 1, 2, 2, 0, 1, 1, 2, 0])).toEqual([0]);
  });

  it('solves a 2D progression', () => {
    expect(candidates(count, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual([9]);
  });

  it('wraps directions around', () => {
    expect(candidates(dir, [6, 7, 0, 7, 0, 1, 0, 1, 2])).toEqual([2]);
  });

  it('rejects a grid where two rules disagree', () => {
    // Rows add up (3 = 1 + 2) but also keep the same total (6), which disagree on the last cell.
    const grid = [1, 2, 3, 2, 1, 3, 3, 3, 6];
    expect(candidates(count, grid)).toEqual(expect.arrayContaining([0, 6]));
    expect(determined(count, grid)).toBe(false);
  });

  it('rejects a set puzzle whose counts suggest another answer', () => {
    // Rows repeat one board each, but the counts 3, 3, 2 also fit "same total per row" with 5.
    const row = (mask) => [mask, mask, mask];
    const grid = [...row(0b111), ...row(0b111000), ...row(0b101000000)];
    expect(candidates(tiles, grid)).toEqual([0b101000000]);
    expect(determined(tiles, grid)).toBe(false);
  });

  it('sees slots that each keep their own direction', () => {
    // Slot 0 is on along the bottom row; slot 1 along the ↘ diagonal through cells 1, 5 and 6.
    const grid = [0, 2, 0, 0, 0, 2, 3, 1, 1];
    expect(candidates(tiles, grid)).toEqual([1]);
    expect(explanations(tiles, grid)).toContain('own lines');
  });
});
