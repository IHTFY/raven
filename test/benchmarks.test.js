import { describe, expect, it } from 'vitest';
import { BENCHMARKS, benchmarkOf, currentBenchmarks, fingerprint, firstTry } from '../src/lib/benchmarks.js';
import { GENERATOR, generateTest } from '../src/lib/engine/generate.js';

describe('benchmarks', () => {
  it('have link-safe seeds and distinct ids', () => {
    for (const b of BENCHMARKS) expect(b.seed).toMatch(/^[a-z0-9]{1,24}$/i);
    expect(new Set(BENCHMARKS.map((b) => b.id)).size).toBe(BENCHMARKS.length);
    expect(currentBenchmarks().length).toBeGreaterThan(0);
  });

  // If this fails, the same seed now builds different puzzles: bump GENERATOR and publish new benchmarks for it.
  it.each(currentBenchmarks())('still build the puzzles they were published with: $name', (b) => {
    expect(fingerprint(generateTest(b.seed))).toBe(b.fingerprint);
  });

  it('find a benchmark by seed and generator, and your first try at it', () => {
    const [b] = currentBenchmarks();
    expect(benchmarkOf(b.seed)).toBe(b);
    expect(benchmarkOf(b.seed, GENERATOR + 1)).toBe(null);
    const history = [
      { seed: b.seed, score: 30, generator: GENERATOR, date: 3 },
      { seed: 'other', score: 10, generator: GENERATOR, date: 2 },
      { seed: b.seed, score: 12, generator: GENERATOR, date: 1 },
      { seed: b.seed, score: 5, generator: GENERATOR - 1, date: 0 },
    ];
    expect(firstTry(b, history).score).toBe(12);
    expect(firstTry(b, [])).toBe(null);
    // Saves from before generators were recorded may have built other puzzles from the same seed.
    expect(firstTry(b, [{ seed: b.seed, score: 7, date: 0 }])).toBe(null);
  });
});
