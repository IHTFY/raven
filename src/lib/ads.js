// The ad on the Results screen comes from the shared IHTFY loader, which
// ihtfy.com serves for all the games (its source is in the IHTFY/com.ihtfy
// repo). Nothing ad-related loads before the first game over: the loader
// arrives then, and AdSense after it at browser idle. A visitor who may have
// bought ad-free gets the loader at startup instead (loadForBuyer), so it can
// hide the Results ad before that screen shows.
const LOADER = import.meta.env.VITE_ADS_LOADER || 'https://ihtfy.com/ads/v1.js';

// The shared 300×250 display unit for game results ("games-results" in AdSense).
// The loader asks for test ads on any host but ihtfy.com, so previews and
// local builds never request live ones.
export const RESULTS_AD_SLOT = '6470163205';

let loader = null;

const load = () =>
  (loader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = LOADER;
    script.addEventListener('load', resolve);
    script.addEventListener('error', () => {
      script.remove();
      loader = null;
      reject(new Error('The ad loader did not load'));
    });
    document.head.appendChild(script);
  }));

/** Loads the loader now if this browser holds an ad-free token; the loader checks it. */
export function loadForBuyer() {
  let stored = null;
  try {
    stored = localStorage.getItem('ihtfy-ad-free');
  } catch {
    // Storage off: the cookie may still hold the token.
  }
  let cookie = '';
  try {
    cookie = document.cookie;
  } catch {
    // Cookies off too (a sandboxed frame): the app must still start.
  }
  if (stored || /(?:^|;\s*)ihtfy-ad-free=/.test(cookie)) load().catch(() => {});
}

/** Fills `box` with an ad for the game over named `key`; offline or on failure it stays empty. */
export function showAd(box, key) {
  if (!navigator.onLine) return;
  load().then(
    () => window.ihtfyAds.show(box, key),
    () => {},
  );
}
