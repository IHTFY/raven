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
  document.cookie = 'ihtfy-ad-free=; Max-Age=0';
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
});
