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
function show(component, props = {}) {
  app = svelte.mount(component, { target: document.body, props });
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
  delete window.ihtfyAds;
  vi.unstubAllGlobals();
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

  it('only sizes boxes the shared loader can fill', async () => {
    const { ads } = await load();
    const loader = ['300x250', '320x50', '320x100', '160x600', '300x600', '728x90'];
    expect(ads.STACKED_AD_SIZES.length).toBeGreaterThan(1);
    for (const size of ads.STACKED_AD_SIZES) expect(loader).toContain(size);
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

  /** Makes `matchMedia` answer true for only the queries in `matching`. */
  const window_ = (...matching) =>
    vi.stubGlobal('matchMedia', (query) => ({
      matches: matching.includes(query),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));

  /**
   * Fakes the layout (happy-dom has none): the block above an ad box ends `above` px down the window, a
   * box adds its own height plus 80 px for the links and the label, and the window is `innerHeight` tall.
   * The aside stretches across the window, as in the page; the box has a fixed width and is centered in it,
   * so a box wider than the window overflows both sides. `padding` is the aside's side padding.
   * Returns nothing; each test checks the sizes the page picked.
   */
  function room({ above, innerHeight, innerWidth = 412, padding = 0 }) {
    vi.stubGlobal('innerHeight', innerHeight);
    vi.stubGlobal('innerWidth', innerWidth);
    const none = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const aside = this.localName === 'aside' ? this : this.closest('aside');
      if (!aside) return none;
      const box = aside.querySelector('[data-ad-slot]');
      const bottom = above + 80 + parseInt(box.style.height, 10);
      if (this === aside) return { top: above, left: 0, right: innerWidth, bottom, width: innerWidth, height: bottom - above };
      if (this !== box) return none;
      const width = parseInt(box.style.width, 10);
      const left = (innerWidth - width) / 2;
      return { top: bottom - parseInt(box.style.height, 10), left, right: left + width, bottom, width, height: parseInt(box.style.height, 10) };
    });
    vi.stubGlobal('getComputedStyle', () => ({ paddingLeft: `${padding}px`, paddingRight: `${padding}px` }));
  }

  it.each([
    ['holds the largest box', 915, 520, '300x250'],
    ['holds 320x100 but not 300x250', 640, 400, '320x100'],
    ['holds only 320x50', 640, 470, '320x50'],
  ])('sizes the Home box by the room left below the content: a window that %s', async (_, innerHeight, above, size) => {
    room({ above, innerHeight });
    const { Home, ads } = await load();
    ads.noteGameFinished();
    const [box] = show(Home);
    expect(box.dataset.adSize).toBe(size);
    expect(box.style.height).toBe(`${size.split('x')[1]}px`);
  });

  it.each([
    ['a phone with room for the largest box', 915, 520, '300x250'],
    ['a short phone', 640, 470, '320x50'],
  ])('sizes the Results box by the room below the results, for %s', async (_, innerHeight, above, size) => {
    window_();
    room({ above, innerHeight });
    const { Results } = await finishedTest();
    const [box] = show(Results);
    expect(box.dataset.adSize).toBe(size);
    const [width, height] = size.split('x');
    expect(box.style.width).toBe(`${width}px`);
    expect(box.style.height).toBe(`${height}px`);
  });

  it('offers only the largest box beside the results on a wide window', async () => {
    window_('(min-width: 1000px) and (min-height: 500px)');
    room({ above: 100, innerHeight: 768, innerWidth: 1366 });
    const { Results } = await finishedTest();
    const [box] = show(Results);
    expect(box.dataset.adSize).toBe('300x250');
  });

  it('puts no box on Home when even the smallest would end below the first screen', async () => {
    room({ above: 520, innerHeight: 640 });
    const { Home, ads } = await load();
    ads.noteGameFinished();
    expect(show(Home)).toHaveLength(0);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
  });

  it('keeps a Privacy link on Home after a game when no box fits, and drops the footer one when a box shows', async () => {
    room({ above: 520, innerHeight: 640 });
    const { Home, ads } = await load();
    ads.noteGameFinished();
    show(Home);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    expect(document.querySelector('footer p:last-child').textContent).toBe('IHTFY · Source · More games · Privacy');
    svelte.unmount(app);
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.spyOn(document.head, 'appendChild').mockImplementation((el) => el);
    room({ above: 500, innerHeight: 915 });
    const [box] = show(Home);
    expect(box).toBeDefined();
    expect(document.querySelector('footer p:last-child').textContent).toBe('IHTFY · Source · More games');
    expect(document.querySelectorAll('a[href="https://ihtfy.com/privacy/"]')).toHaveLength(1);
  });

  it('brings the footer Privacy link back on Home while a resize hides the box', async () => {
    room({ above: 500, innerHeight: 915 });
    const { Home, ads } = await load();
    ads.noteGameFinished();
    show(Home);
    const footer = () => document.querySelector('footer p:last-child').textContent;
    expect(footer()).toBe('IHTFY · Source · More games');
    vi.stubGlobal('innerHeight', 640);
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(footer()).toBe('IHTFY · Source · More games · Privacy');
    vi.stubGlobal('innerHeight', 915);
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(footer()).toBe('IHTFY · Source · More games');
  });

  it('hides the Results box when a resize leaves the window narrower than the box and its padding', async () => {
    window_();
    room({ above: 300, innerHeight: 915, innerWidth: 412, padding: 16 });
    const { Results } = await finishedTest();
    const [box] = show(Results);
    const aside = box.closest('aside');
    expect(box.dataset.adSize).toBe('300x250');
    expect(aside.style.display).toBe('');
    // 330 px: the box still lies inside the window, but not inside the aside's padded content (298 px).
    room({ above: 300, innerHeight: 915, innerWidth: 330, padding: 16 });
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(aside.style.display).toBe('none');
    // 290 px: the box overflows the window itself.
    room({ above: 300, innerHeight: 915, innerWidth: 290, padding: 0 });
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(aside.style.display).toBe('none');
    room({ above: 300, innerHeight: 915, innerWidth: 412, padding: 16 });
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(aside.style.display).toBe('');
    expect(box.dataset.adSize).toBe('300x250');
  });

  it('puts no box on Results when even the smallest would end below the first screen', async () => {
    room({ above: 420, innerHeight: 412, innerWidth: 915 });
    window_();
    const { Results } = await finishedTest();
    expect(show(Results)).toHaveLength(0);
  });

  it('keeps the size it picked when the window resizes, and hides the box while it no longer fits', async () => {
    room({ above: 500, innerHeight: 915 });
    const { Home, ads } = await load();
    ads.noteGameFinished();
    const [box] = show(Home);
    const aside = box.closest('aside');
    expect(box.dataset.adSize).toBe('300x250');
    expect(aside.style.display).toBe('');
    vi.stubGlobal('innerHeight', 640);
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(document.querySelector('[data-ad-slot]')).toBe(box);
    expect(box.dataset.adSize).toBe('300x250');
    expect(aside.style.display).toBe('none');
    vi.stubGlobal('innerHeight', 915);
    dispatchEvent(new Event('resize'));
    svelte.flushSync();
    expect(aside.style.display).toBe('');
    expect(box.dataset.adSize).toBe('300x250');
  });

  it('puts no box on a window too narrow to hold one', async () => {
    window_('(max-width: 351px)', '(min-height: 700px)');
    const { Home, Results, ads } = await finishedTest();
    expect(show(Results)).toHaveLength(0);
    svelte.unmount(app);
    document.body.innerHTML = '';
    ads.noteGameFinished();
    expect(show(Home)).toHaveLength(0);
  });

  it('spaces the footer links evenly, Privacy included, on a Home without an ad', async () => {
    const { Home } = await load();
    show(Home);
    expect(document.querySelector('footer p:last-child').textContent).toBe('IHTFY · Source · More games · Privacy');
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

  it('puts no box on a past test, and reopening one does not count as finishing a game', async () => {
    const { Home, Results, state } = await load();
    state.startTest('abc');
    state.finishTest();
    expect(show(Results, { past: state.store.history[0] })).toHaveLength(0);
    svelte.unmount(app);
    document.body.innerHTML = '';
    expect(show(Home)).toHaveLength(0);
  });

  it('puts no box on a test or on practice', async () => {
    window_('(min-height: 700px)');
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

describe('a stored ad-free token whose check is still pending', () => {
  const settle = async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
    svelte.flushSync();
  };

  /**
   * The shared loader as a test double. The token check stays pending until `answer(free)` runs: it
   * reports a pending check by returning a promise, and `free` is what the loader decides.
   */
  function loaderDouble() {
    let answer;
    window.ihtfyAds = { show: vi.fn(), adFree: () => new Promise((resolve) => (answer = resolve)) };
    return {
      /** The page has asked for the loader: let it arrive. */
      async arrive() {
        const script = document.head.appendChild.mock.calls.map(([el]) => el).find((el) => el.src?.endsWith('/ads/v1.js'));
        script.dispatchEvent(new Event('load'));
        await settle();
      },
      async answer(free) {
        answer(free);
        await settle();
      },
    };
  }

  const wide = () =>
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query === '(min-width: 1500px) and (min-height: 700px)',
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));

  async function finishedTest() {
    const loaded = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    loaded.state.startTest('abc');
    loaded.state.finishTest();
    return loaded;
  }

  it('holds no space on Results while pending, then adds the box when the token is rejected', async () => {
    const { Results } = await finishedTest();
    const loader = loaderDouble();
    expect(show(Results)).toHaveLength(0);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    await loader.arrive();
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    await loader.answer(false);
    const boxes = [...document.querySelectorAll('[data-ad-slot]')];
    expect(boxes).toHaveLength(1);
    expect(boxes[0].dataset.adSlot).toBe('6470163205');
  });

  it('keeps Results free of a box for a confirmed buyer', async () => {
    const { Results } = await finishedTest();
    const loader = loaderDouble();
    show(Results);
    await loader.arrive();
    await loader.answer(true);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    expect(document.querySelectorAll('[data-ad-slot]')).toHaveLength(0);
  });

  it('gives Home its ad layout when the token is rejected', async () => {
    const { Home, ads } = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    ads.noteGameFinished();
    const loader = loaderDouble();
    show(Home);
    // The logo shows only on a Home without an ad.
    expect(document.querySelector('.logo')).not.toBeNull();
    await loader.arrive();
    await loader.answer(false);
    expect(document.querySelectorAll('[data-ad-slot]')).toHaveLength(1);
    expect(document.querySelector('.logo')).toBeNull();
  });

  it('keeps Home free of a box for a confirmed buyer', async () => {
    const { Home, ads } = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    ads.noteGameFinished();
    const loader = loaderDouble();
    show(Home);
    await loader.arrive();
    await loader.answer(true);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
    expect(document.querySelector('.logo')).not.toBeNull();
  });

  it('holds no rail beside the puzzles while pending, then adds it when the token is rejected', async () => {
    wide();
    const { Quiz, state } = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    state.startTest('abc');
    const loader = loaderDouble();
    expect(show(Quiz)).toHaveLength(0);
    // Gameplay and its controls are there throughout.
    expect(document.querySelector('[aria-label="All puzzles"]')).not.toBeNull();
    await loader.arrive();
    await loader.answer(false);
    const boxes = [...document.querySelectorAll('[data-ad-slot]')];
    expect(boxes.map((b) => b.dataset.adSize)).toEqual(['300x600']);
    expect(document.querySelector('[aria-label="All puzzles"]')).not.toBeNull();
  });

  it('keeps the rail away for a confirmed buyer', async () => {
    wide();
    const { Quiz, state } = await load();
    localStorage.setItem('ihtfy-ad-free', 'token');
    state.startTest('abc');
    const loader = loaderDouble();
    show(Quiz);
    await loader.arrive();
    await loader.answer(true);
    expect(document.querySelectorAll('aside')).toHaveLength(0);
  });

  it('keeps the space collapsed when the loader never arrives', async () => {
    const { Results } = await finishedTest();
    loaderDouble();
    show(Results);
    const script = document.head.appendChild.mock.calls.map(([el]) => el).find((el) => el.src?.endsWith('/ads/v1.js'));
    script.dispatchEvent(new Event('error'));
    await settle();
    expect(document.querySelectorAll('aside')).toHaveLength(0);
  });
});
