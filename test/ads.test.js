// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let added;

async function loadAds() {
  vi.resetModules();
  return import('../src/lib/ads.js');
}

const tick = () => new Promise((resolve) => setTimeout(resolve));

beforeEach(() => {
  added = [];
  // Record script tags instead of fetching them.
  vi.spyOn(document.head, 'appendChild').mockImplementation((el) => {
    added.push(el);
    return el;
  });
  window.ihtfyAds = { show: vi.fn() };
});

afterEach(() => {
  vi.restoreAllMocks();
  delete window.ihtfyAds;
  localStorage.clear();
  // An expiry in the past; happy-dom sometimes keeps an empty cookie after Max-Age=0.
  document.cookie = 'ihtfy-ad-free=; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
});

describe('showAd', () => {
  it('loads the shared loader once, then hands it each box', async () => {
    const { showAd } = await loadAds();
    const box = document.createElement('div');
    showAd(box, 'a');
    showAd(box, 'b');
    expect(added).toHaveLength(1);
    expect(added[0].src).toBe('https://ihtfy.com/ads/v1.js');
    added[0].dispatchEvent(new Event('load'));
    await tick();
    expect(window.ihtfyAds.show.mock.calls).toEqual([
      [box, 'a'],
      [box, 'b'],
    ]);
  });

  it('loads nothing offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const { showAd } = await loadAds();
    showAd(document.createElement('div'), 'a');
    expect(added).toHaveLength(0);
  });

  it('stays quiet when the loader fails, and tries again on the next game over', async () => {
    const { showAd } = await loadAds();
    showAd(document.createElement('div'), 'a');
    added[0].dispatchEvent(new Event('error'));
    await tick();
    expect(window.ihtfyAds.show).not.toHaveBeenCalled();
    showAd(document.createElement('div'), 'b');
    expect(added).toHaveLength(2);
  });
});

describe('loadForBuyer', () => {
  it('loads nothing for a visitor without an ad-free token', async () => {
    const { loadForBuyer } = await loadAds();
    loadForBuyer();
    expect(added).toHaveLength(0);
  });

  it('loads the loader at startup when localStorage holds a token', async () => {
    localStorage.setItem('ihtfy-ad-free', 'token');
    const { loadForBuyer, showAd } = await loadAds();
    loadForBuyer();
    expect(added).toHaveLength(1);
    expect(added[0].src).toBe('https://ihtfy.com/ads/v1.js');
    showAd(document.createElement('div'), 'a');
    expect(added).toHaveLength(1);
  });

  it('loads the loader at startup when only the cookie holds a token', async () => {
    document.cookie = 'ihtfy-ad-free=token';
    const { loadForBuyer } = await loadAds();
    loadForBuyer();
    expect(added).toHaveLength(1);
  });

  it('starts quietly when storage and cookies both throw', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get() {
        throw new Error('denied');
      },
    });
    try {
      const { loadForBuyer } = await loadAds();
      expect(() => loadForBuyer()).not.toThrow();
      expect(added).toHaveLength(0);
    } finally {
      delete document.cookie;
    }
  });
});

describe('showPlayAd', () => {
  it('loads nothing until the first tap or key press', async () => {
    const { showPlayAd } = await loadAds();
    const box = document.createElement('div');
    showPlayAd(box, 'test/1');
    await tick();
    expect(added).toHaveLength(0);
    dispatchEvent(new Event('pointerdown'));
    await tick();
    expect(added).toHaveLength(1);
    added[0].dispatchEvent(new Event('load'));
    await tick();
    expect(window.ihtfyAds.show.mock.calls).toEqual([[box, 'test/1']]);
  });

  it('starts at once after an earlier key press', async () => {
    const { showPlayAd } = await loadAds();
    dispatchEvent(new Event('keydown'));
    showPlayAd(document.createElement('div'), 'practice/1');
    await tick();
    expect(added).toHaveLength(1);
  });
});

describe('mayBeAdFree', () => {
  it('tells whether this browser holds a token', async () => {
    const { mayBeAdFree } = await loadAds();
    expect(mayBeAdFree()).toBe(false);
    localStorage.setItem('ihtfy-ad-free', 'token');
    expect(mayBeAdFree()).toBe(true);
  });
});
