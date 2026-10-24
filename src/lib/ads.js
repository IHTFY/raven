// The ads on the Results and Home screens and beside the puzzles come from the
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

// Whether this tab has shown a finished game. The Home screen gets an ad only
// after one, so a first visit opens on a page without it.
let gameFinished = false;

/** Notes that a finished game was shown in this tab, which lets the Home screen carry an ad. */
export const noteGameFinished = () => {
  gameFinished = true;
};

/**
 * The AdSense unit for the ad box on a screen, or null for no box. Only Results
 * and, once a game has finished in this tab, Home carry one; the test and
 * practice screens never do on a phone (the rail beside them is `PlayAd`'s). A
 * visitor who may have bought ad-free gets none, and no space is held for it.
 */
export function screenAdSlot(screen) {
  if (mayBeAdFree()) return null;
  if (screen === 'results' || (screen === 'home' && gameFinished)) return RESULTS_AD_SLOT;
  return null;
}

// The size of the ad box on a screen, by window, first match wins: beside the
// result on wide windows, or below it, as large as the screen holds with the
// result and its buttons in view and 50 px between them and the box.
const STACKED_SIZES = [
  { query: '(min-height: 860px)', size: '300x250' },
  { query: '(min-height: 700px)', size: '320x100' },
  { query: 'all', size: '320x50' },
];

export const SCREEN_AD_SIZES = {
  results: [{ query: '(min-width: 1000px) and (min-height: 500px)', size: '300x250' }, ...STACKED_SIZES],
  home: STACKED_SIZES,
};

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

// The player's first tap or key press. A link straight to a test or practice,
// or a reload on the results, opens a screen with an ad, and the ad code waits
// for this, not for the page load.
const firstInput = new Promise((resolve) => {
  for (const type of ['pointerdown', 'keydown']) addEventListener(type, resolve, { once: true, capture: true });
});

/** Fills `box` with an ad once the player has tapped or pressed a key, if the box is still on the page. */
export function showAdAfterInput(box, key) {
  firstInput.then(() => {
    if (box.isConnected) showAd(box, key);
  });
}
