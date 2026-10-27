import { describe, expect, it } from 'vitest';
import { attempts, byCombination, byFamily, byPosition, byRule, comboName, histogram, median, parseKind, summary } from '../src/lib/stats.js';

const test = (score, seconds, extra = {}) => ({ seed: 's', score, total: 4, seconds, date: score, ...extra });

describe('statistics', () => {
  it('reads kinds', () => {
    expect(parseKind('tiles:or+rows')).toEqual({ family: 'tiles', rules: ['or', 'rows'] });
    expect(comboName('or+rows')).toBe('Union (A + B) · Same along each row');
  });

  it('takes medians', () => {
    expect(median([])).toBe(null);
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
  });

  it('sums up tests', () => {
    expect(summary([test(2, 100), test(4, 300), test(3, 200)])).toEqual({ tests: 3, best: 4, average: 3, share: 0.75, seconds: 200 });
    expect(summary([]).best).toBe(null);
  });

  it('bins scores, the last bin holding a perfect score', () => {
    const bins = histogram([test(0, 1), test(2, 1), test(3, 1), test(4, 1)], 4, 2);
    expect(bins.map((b) => [b.from, b.to, b.count])).toEqual([
      [0, 1, 1],
      [2, 3, 2],
      [4, 4, 1],
    ]);
  });

  it('times each position over the tests that kept times', () => {
    const history = [
      test(2, 1, { times: [1, 2, 3, 4], outcomes: 'rrw-' }),
      test(3, 1, { times: [3, 4, 5, 6], outcomes: 'rwr-' }),
      test(1, 1),
    ];
    const rows = byPosition(history, 4);
    expect(rows.map((r) => r.seconds)).toEqual([2, 3, 4, 5]);
    expect(rows.map((r) => r.right)).toEqual([1, 0.5, 0.5, null]);
  });

  it('ranks rules, styles, and combinations by share right, leaving out blanks', () => {
    const history = [test(2, 1, { kinds: ['tiles:xor', 'tiles:or+rows', 'shapes:rows', 'shapes:rows'], outcomes: 'wrr-', times: [9, 3, 2, 1] })];
    const log = [{ kind: 'lines:xor', right: true, seconds: 5, target: 3, date: 1 }];
    const list = attempts(history, log);
    expect(list).toHaveLength(4);
    expect(byRule(list).map((r) => [r.key, r.count, r.share])).toEqual([
      ['xor', 2, 0.5],
      ['or', 1, 1],
      ['rows', 2, 1],
    ]);
    expect(byRule(list).find((r) => r.key === 'xor').seconds).toBe(7);
    expect(byFamily(list).map((r) => r.key)).toEqual(['tiles', 'lines', 'shapes']);
    expect(byCombination(list, 2).map((r) => r.key)).toEqual(['xor']);
  });
});
