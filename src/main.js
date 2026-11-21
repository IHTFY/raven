import { mount } from 'svelte';
import App from './App.svelte';
import { loadForBuyer } from './lib/ads.js';
import { playLaunch } from './lib/launch.js';
import './app.css';

loadForBuyer();
mount(App, { target: document.getElementById('app') });
// Defined only on a fresh launch of the installed app (index.html): carries its launch screen into Home.
globalThis.launchExit?.(playLaunch);

// Offline play and install. Production only, so the dev server never serves stale files.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Unsupported or blocked: the site works the same without it.
    });
  });
}
