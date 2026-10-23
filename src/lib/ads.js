// The ads on the Results screen and beside the puzzles come from the
// shared IHTFY loader, which ihtfy.com serves for all the games (its source is
// in the IHTFY/com.ihtfy repo). Nothing ad-related loads before the player's
// first tap or key press: the loader arrives when a test or practice starts or
// a game ends, and AdSense after it at browser idle. A visitor who may have
// bought ad-free gets the loader at startup instead (loadForBuyer), so it can
// hide the ads before they show.
const LOADER = import.meta.env.VITE_ADS_LOADER || 'https://ihtfy.com/ads/v1.js';

// The shared 300×250 display unit for game results ("games-results" in AdSense).
// The loader asks for test ads on any host but ihtfy.com, so previews and
// local builds never request live ones.
export const RESULTS_AD_SLOT = '6470163205';

// The games-play unit: 300×600 in AdSense; the 160×600 box uses it too.
export const PLAY_AD_SLOT = '7239875855';

// The size of the ad beside the puzzles during play, by window, first match
// wins. Narrower or shorter windows, phones included, get no ad during play.
export const PLAY_AD_SIZES = [
  { query: '(min-width: 1500px) and (min-height: 700px)', size: '300x600' },
  { query: '(min-width: 1200px) and (min-height: 700px)', size: '160x600' },
];

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

/** Whether this browser holds an ad-free token, unchecked; the loader checks it. */
export function mayBeAdFree() {
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
  return Boolean(stored) || /(?:^|;\s*)ihtfy-ad-free=/.test(cookie);
}

/** Loads the loader now if this browser holds an ad-free token, so it can hide every ad box. */
export function loadForBuyer() {
  if (mayBeAdFree()) load().catch(() => {});
}

/** Fills `box` with an ad for the game over named `key`; offline or on failure it stays empty. */
export function showAd(box, key) {
  if (!navigator.onLine) return;
  load().then(
    () => window.ihtfyAds.show(box, key),
    () => {},
  );
}

// The player's first tap or key press. A link straight to a test or practice
// opens a screen with an ad, and the ad code waits for this, not for the page
// load.
const firstInput = new Promise((resolve) => {
  for (const type of ['pointerdown', 'keydown']) addEventListener(type, resolve, { once: true, capture: true });
});

/** Fills `box` with the ad shown during play, once the player has tapped or pressed a key, if the box is still on the page. */
export function showPlayAd(box, key) {
  firstInput.then(() => {
    if (box.isConnected) showAd(box, key);
  });
}
