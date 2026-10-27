// @vitest-environment happy-dom
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, expect, it } from 'vitest';
import Review from '../src/lib/components/Review.svelte';
import { EASIEST, HARDEST, generatePuzzle } from '../src/lib/engine/generate.js';

const at = (i) => generatePuzzle(`explain/${i}`, EASIEST + ((HARDEST - EASIEST) * (i % 20)) / 19);

let app;
afterEach(() => {
  unmount(app);
  document.body.innerHTML = '';
});

it('starts the next puzzle’s demo from its first step', () => {
  // Both explain their "tiles" attribute: an overlay demo with 6 steps, then an xor demo with 3.
  const puzzles = [at(5), at(14)];
  expect(puzzles.map((p) => p.rules.map((r) => `${r.attr}:${r.rule}`))).toEqual([['tiles:overlay'], ['tiles:xor']]);

  app = mount(Review, { target: document.body, props: { puzzles, answers: [null, null], index: 0 } });
  flushSync();
  document.querySelector('[aria-label="Step 6"]').click();
  flushSync();
  document.querySelector('[aria-label="Next puzzle"]').click();
  flushSync();

  expect(document.querySelectorAll('.dot')).toHaveLength(3);
  expect(document.querySelector('.dot.here').getAttribute('aria-label')).toBe('Step 1');
  expect(document.querySelector('figcaption').textContent).toMatch(/\S/);
});
