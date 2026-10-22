// The ad on the Results screen comes from the shared IHTFY loader, which
// ihtfy.com serves for all the games (its source is in the IHTFY/com.ihtfy
// repo). Nothing ad-related loads before the first game over: the loader
// arrives then, and AdSense after it at browser idle.
const LOADER = import.meta.env.VITE_ADS_LOADER || 'https://ihtfy.com/ads/v1.js';

// The shared 300×250 display unit for game results ("games-results" in AdSense).
// The loader asks for test ads on any host but ihtfy.com, so previews and
// local builds never request live ones.
export const RESULTS_AD_SLOT = '6470163205';

let loader = null;

/** Fills `box` with an ad for the game over named `key`; offline or on failure it stays empty. */
export function showAd(box, key) {
  if (!navigator.onLine) return;
  loader ??= new Promise((resolve, reject) => {
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
  });
  loader.then(
    () => window.ihtfyAds.show(box, key),
    () => {},
  );
}
