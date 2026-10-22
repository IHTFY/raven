// The ad on the Results screen comes from the shared IHTFY loader, which
// ihtfy.com serves for all the games (its source is in the IHTFY/com.ihtfy
// repo). Nothing ad-related loads before the first game over: the loader
// arrives then, and AdSense after it at browser idle.
const LOADER = import.meta.env.VITE_ADS_LOADER || 'https://ihtfy.com/ads/v1.js';

// TODO: the id of the 300×250 display unit for Raven's results, once it's
// created in AdSense. Without one the loader asks for an ad with no unit id.
export const RESULTS_AD_SLOT = '';

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
