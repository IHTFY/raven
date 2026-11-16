// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

let updates;
let transition;
let finish;
let start;

beforeEach(() => {
  vi.resetModules();
  localStorage.setItem('raven', JSON.stringify({ theme: 'light' }));
  vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  updates = [];
  transition = { skipTransition: vi.fn(), finished: new Promise((resolve) => (finish = resolve)) };
  start = vi.fn((apply) => {
    updates.push(apply);
    return transition;
  });
  Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
});

afterEach(() => {
  delete document.startViewTransition;
  localStorage.clear();
  vi.restoreAllMocks();
});

it('animates a single theme change and allows another transition after it finishes', async () => {
  const { currentTheme, toggleTheme } = await import('../src/lib/state.svelte.js');
  toggleTheme();
  expect(start).toHaveBeenCalledOnce();
  expect(currentTheme()).toBe('light');
  updates.shift()();
  expect(currentTheme()).toBe('dark');
  expect(transition.skipTransition).not.toHaveBeenCalled();
  finish();
  await transition.finished;
  toggleTheme();
  expect(start).toHaveBeenCalledTimes(2);
  updates.shift()();
  expect(currentTheme()).toBe('light');
});

it.each([2, 10])('counts all %i toggles before the first snapshot update', async (count) => {
  const { currentTheme, toggleTheme } = await import('../src/lib/state.svelte.js');
  for (let i = 0; i < count; i++) toggleTheme();
  // Skipping a pending transition still runs its update callback.
  for (const apply of updates) apply();
  expect(currentTheme()).toBe('light');
  expect(transition.skipTransition).toHaveBeenCalled();
});

it.each([2, 10])('counts all %i toggles while the first transition animates', async (count) => {
  const { currentTheme, toggleTheme } = await import('../src/lib/state.svelte.js');
  toggleTheme();
  updates.shift()();
  expect(currentTheme()).toBe('dark');
  for (let i = 1; i < count; i++) toggleTheme();
  expect(currentTheme()).toBe('light');
  expect(transition.skipTransition).toHaveBeenCalled();
});

it('changes the theme immediately without view transition support', async () => {
  delete document.startViewTransition;
  const { currentTheme, toggleTheme } = await import('../src/lib/state.svelte.js');
  toggleTheme();
  expect(currentTheme()).toBe('dark');
  toggleTheme();
  expect(currentTheme()).toBe('light');
});

it('changes the theme immediately when reduced motion is requested', async () => {
  window.matchMedia.mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    addEventListener() {},
    removeEventListener() {},
  }));
  const { currentTheme, toggleTheme } = await import('../src/lib/state.svelte.js');
  toggleTheme();
  expect(currentTheme()).toBe('dark');
  expect(start).not.toHaveBeenCalled();
});

it.each([2, 10])('forwards snapshot clicks to the theme button exactly once during %i toggles', async (count) => {
  const { mount, flushSync, unmount } = await import('svelte');
  const { default: Home } = await import('../src/lib/components/Home.svelte');
  const { currentTheme } = await import('../src/lib/state.svelte.js');
  // Keep external scripts out of component tests.
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
  const home = mount(Home, { target: document.body });
  try {
    flushSync();
    const toggle = document.querySelector('[aria-label="Use dark theme"]');
    vi.spyOn(toggle, 'getBoundingClientRect').mockReturnValue({ left: 10, top: 10, right: 54, bottom: 54 });
    const click = vi.spyOn(toggle, 'click');
    toggle.click();
    updates.shift()();
    for (let i = 1; i < count; i++) {
      document.documentElement.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 32, clientY: 32 }));
    }
    expect(currentTheme()).toBe('light');
    expect(click).toHaveBeenCalledTimes(count);
    document.documentElement.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80, clientY: 80 }));
    expect(click).toHaveBeenCalledTimes(count);
  } finally {
    unmount(home);
    document.body.innerHTML = '';
  }
});
