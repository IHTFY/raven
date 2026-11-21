import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

/** The color tokens one theme's rule sets. */
function tokens(selector) {
  const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/g)].map(([, name, value]) => [name, value]));
}

/** Relative luminance of a `#rrggbb` color, as WCAG defines it. */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

// Every one of these colors text somewhere, on a surface that shares the page color.
const TEXT = ['text', 'muted', 'accent', 'good', 'bad'];

describe('theme colors', () => {
  for (const [theme, selector] of [
    ['dark', ':root'],
    ['light', ":root[data-theme='light']"],
  ]) {
    it(`gives text in the ${theme} theme a contrast of at least 4.5:1 on the page color`, () => {
      const colors = tokens(selector);
      for (const name of TEXT) expect(contrast(colors[name], colors.bg), `--${name} ${colors[name]} on ${colors.bg}`).toBeGreaterThanOrEqual(4.5);
    });
  }
});
