// @vitest-environment happy-dom
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import Sheet from '../src/lib/components/Sheet.svelte';

let app;
// The test DOM's animations reject when a sheet is torn down mid-slide; the transitions are not what is under test.
const animate = Element.prototype.animate;
beforeAll(() => {
  Element.prototype.animate = () => ({ cancel() {}, finished: Promise.resolve(), currentTime: 0, effect: null });
});
afterAll(() => {
  Element.prototype.animate = animate;
});
afterEach(() => {
  if (app) unmount(app);
  app = null;
  document.body.innerHTML = '';
});

const children = createRawSnippet(() => ({ render: () => '<div><button id="a">A</button><button id="b">B</button></div>' }));

function open(onclose = () => {}) {
  document.body.innerHTML = '<button id="behind1">One</button><button id="behind2">Two</button><div id="root"></div>';
  document.getElementById('behind1').focus();
  app = mount(Sheet, { target: document.getElementById('root'), props: { title: 'Puzzle 1', onclose, children } });
  flushSync();
}

const tab = (shiftKey = false) => {
  const e = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true, bubbles: true });
  (document.activeElement ?? document.body).dispatchEvent(e);
  return e;
};

it('moves focus into the sheet when it opens', () => {
  open();
  expect(document.querySelector('.sheet').contains(document.activeElement)).toBe(true);
});

it('keeps Tab and Shift+Tab inside the sheet', () => {
  open();
  document.getElementById('b').focus();
  expect(tab().defaultPrevented).toBe(true);
  expect(document.activeElement.getAttribute('aria-label')).toBe('Close');
  expect(tab(true).defaultPrevented).toBe(true);
  expect(document.activeElement.id).toBe('b');
});

it('sends Shift+Tab from the freshly opened sheet to its last control', () => {
  open();
  expect(document.activeElement).toBe(document.querySelector('.sheet'));
  expect(tab(true).defaultPrevented).toBe(true);
  expect(document.activeElement.id).toBe('b');
});

it('pulls focus back from the page behind', () => {
  open();
  document.getElementById('behind2').focus();
  expect(tab().defaultPrevented).toBe(true);
  expect(document.querySelector('.sheet').contains(document.activeElement)).toBe(true);
});

it('still closes on Escape', () => {
  const onclose = vi.fn();
  open(onclose);
  document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(onclose).toHaveBeenCalledOnce();
});

it('returns focus to the control that opened it', () => {
  open();
  unmount(app);
  app = null;
  flushSync();
  expect(document.activeElement.id).toBe('behind1');
});
