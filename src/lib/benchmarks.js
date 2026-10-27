/**
 * Benchmark tests: fixed seeds that everyone takes, so scores compare
 * across people rather than across random tests. A seed only builds the
 * same puzzles under the generator it was published with, so each
 * benchmark names its generator and a fingerprint of its puzzles; a test
 * fails if a change alters them without a new generator version.
 */

import { GENERATOR } from './engine/generate.js';

export const BENCHMARKS = [
  { id: 'a', name: 'Benchmark A', seed: 'benchmarka', generator: 4, fingerprint: '5949b11c' },
  { id: 'b', name: 'Benchmark B', seed: 'benchmarkb', generator: 4, fingerprint: '2d4bfde0' },
  { id: 'c', name: 'Benchmark C', seed: 'benchmarkc', generator: 4, fingerprint: '9196df75' },
];

/** Benchmarks this version of the app can build. */
export const currentBenchmarks = () => BENCHMARKS.filter((b) => b.generator === GENERATOR);

/** Your first finished try at a benchmark: the one that compares fairly with other people's. */
export const firstTry = (benchmark, history) =>
  history.findLast((h) => h.seed === benchmark.seed && h.generator === benchmark.generator) ?? null;

export const benchmarkOf = (seed, generator = GENERATOR) => BENCHMARKS.find((b) => b.seed === seed && b.generator === generator) ?? null;

/** A short hash of a test's puzzles: their pictures, options, and answers. */
export function fingerprint(puzzles) {
  const text = JSON.stringify(puzzles.map((p) => [p.cells, p.options, p.answer]));
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0');
}
