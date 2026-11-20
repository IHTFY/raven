// @vitest-environment happy-dom
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Stats from '../src/lib/components/Stats.svelte';
import { TEST_LENGTH } from '../src/lib/engine/generate.js';
import { store } from '../src/lib/state.svelte.js';

let app;
beforeEach(() => {
  store.history = [{ seed: 'xyz', score: 0, total: TEST_LENGTH, seconds: 5, date: 9, answers: [], times: [], kinds: [], outcomes: '' }];
});
afterEach(() => {
  unmount(app);
  document.body.innerHTML = '';
  store.history = [];
  vi.restoreAllMocks();
});

/** The text of the tile labeled `label`. */
const tile = (label) => [...document.querySelectorAll('.tile')].find((t) => t.textContent.includes(label)).querySelector('b').textContent;

/** Makes the browser's default locale `locale` for number formatting. */
function browserLocale(locale) {
  const real = Number.prototype.toLocaleString;
  vi.spyOn(Number.prototype, 'toLocaleString').mockImplementation(function (loc, options) {
    return real.call(this, loc ?? locale, options);
  });
}

it('shows the average with the browser’s decimal separator', () => {
  browserLocale('fr-FR');
  app = mount(Stats, { target: document.body });
  flushSync();
  expect(tile('average')).toBe('0,0');
});

it('shows a period where the browser uses one', () => {
  browserLocale('en-US');
  app = mount(Stats, { target: document.body });
  flushSync();
  expect(tile('average')).toBe('0.0');
});

it('keeps the digits `toFixed` gives where the mean sits on a rounding edge', () => {
  browserLocale('en-US');
  store.history = Array.from({ length: 20 }, (_, i) => ({ seed: 'xyz', score: i < 17 ? 20 : 21, total: TEST_LENGTH, seconds: 5, date: i, answers: [], times: [], kinds: [], outcomes: '' }));
  app = mount(Stats, { target: document.body });
  flushSync();
  expect(tile('average')).toBe('20.1');
});
