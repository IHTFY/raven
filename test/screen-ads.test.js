// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let app;
let svelte;

/** Fresh copies of the modules, so each test starts a new tab: no game finished, no state saved. */
async function load() {
  vi.resetModules();
  svelte = await import('svelte');
  const [ads, state, Home, Results, Quiz, Practice] = await Promise.all([
    import('../src/lib/ads.js'),
    import('../src/lib/state.svelte.js'),
    import('../src/lib/components/Home.svelte'),
    import('../src/lib/components/Results.svelte'),
    import('../src/lib/components/Quiz.svelte'),
    import('../src/lib/components/Practice.svelte'),
  ]);
  return { ads, state, Home: Home.default, Results: Results.default, Quiz: Quiz.default, Practice: Practice.default };
}

/** Shows `component` and returns the ad boxes on the page. */
function show(component) {
  app = svelte.mount(component, { target: document.body });
  svelte.flushSync();
  return [...document.querySelectorAll('[data-ad-slot]')];
}

beforeEach(() => {
  localStorage.clear();
  document.cookie = 'ihtfy-ad-free=; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  // The ad code only runs after a tap, and no loader is fetched here.
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
});

afterEach(() => {
  if (app) svelte.unmount(app);
  app = null;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('screenAdSlot', () => {
  it('gives Results the results unit', async () => {
    const { ads } = await load();
    expect(ads.screenAdSlot('results')).toBe(ads.RESULTS_AD_SLOT);
  });

  it('gives Home a unit only after a game finished in this tab', async () => {
    const { ads } = await load();
    expect(ads.screenAdSlot('home')).toBeNull();
    ads.noteGameFinished();
    expect(ads.screenAdSlot('home')).toBe(ads.RESULTS_AD_SLOT);
  });

  it('never gives a screen where a game is in progress a unit', async () => {
    const { ads } = await load();
    ads.noteGameFinished();
    expect(ads.screenAdSlot('quiz')).toBeNull();
    expect(ads.screenAdSlot('practice')).toBeNull();
    expect(ads.screenAdSlot('anything-else')).toBeNull();
  });

  it.each([
    ['localStorage', () => localStorage.setItem('ihtfy-ad-free', 'token')],
    ['a cookie', () => (document.cookie = 'ihtfy-ad-free=token')],
  ])('gives a buyer no unit on any screen, by %s', async (_, buy) => {
    const { ads } = await load();
    buy();
    ads.noteGameFinished();
    for (const screen of ['results', 'home', 'quiz', 'practice']) expect(ads.screenAdSlot(screen)).toBeNull();
  });

  it('only sizes boxes the shared loader can fill, each with a size to fall back to', async () => {
    const { ads } = await load();
    const loader = ['300x250', '320x50', '320x100', '160x600', '300x600', '728x90'];
    for (const sizes of Object.values(ads.SCREEN_AD_SIZES)) {
      expect(sizes.at(-1).query).toBe('all');
      for (const { size } of sizes) expect(loader).toContain(size);
    }
  });
});

describe('the screens', () => {
  async function finishedTest() {
    const loaded = await load();
    loaded.state.startTest('abc');
    loaded.state.finishTest();
    return loaded;
  }

  it('puts one labeled box on Results, with the Privacy link ending in a slash', async () => {
    const { Results } = await finishedTest();
    const boxes = show(Results);
    expect(boxes).toHaveLength(1);
    expect(boxes[0].dataset.adSlot).toBe('6470163205');
    const aside = boxes[0].closest('aside');
    expect(aside.textContent).toContain('Advertisements');
    expect(aside.querySelector('a').href).toBe('https://ihtfy.com/privacy/');
  });

  it('sizes the box before any ad fills it, from the window', async () => {
    const { Results } = await finishedTest();
    const [box] = show(Results);
    const [width, height] = box.dataset.adSize.split('x');
    expect(box.style.width).toBe(`${width}px`);
    expect(box.style.height).toBe(`${height}px`);
  });

  it('puts no box on Home in a fresh tab, and one after Results was shown', async () => {
    const { Home, Results, state } = await load();
    state.startTest('abc');
    state.finishTest();
    expect(show(Home)).toHaveLength(0);
    svelte.unmount(app);
    show(Results);
    svelte.unmount(app);
    document.body.innerHTML = '';
    const boxes = show(Home);
    expect(boxes).toHaveLength(1);
    expect(boxes[0].closest('aside').textContent).toContain('Advertisements');
  });

  it('puts no box on a test or on practice', async () => {
    const { Quiz, Practice, ads, state } = await load();
    ads.noteGameFinished();
    state.startTest('abc');
    expect(show(Quiz)).toHaveLength(0);
    svelte.unmount(app);
    document.body.innerHTML = '';
    expect(show(Practice)).toHaveLength(0);
  });

  it('puts no box and no aside on Results or Home for a buyer', async () => {
    const { Home, Results, state } = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    state.startTest('abc');
    state.finishTest();
    expect(show(Results)).toHaveLength(0);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    svelte.unmount(app);
    document.body.innerHTML = '';
    expect(show(Home)).toHaveLength(0);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
  });
});
