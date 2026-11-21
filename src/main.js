import { mount } from 'svelte';
import App from './App.svelte';
import { loadForBuyer } from './lib/ads.js';
import './app.css';

loadForBuyer();
mount(App, { target: document.getElementById('app') });

// Offline play and install. Production only, so the dev server never serves stale files.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Unsupported or blocked: the site works the same without it.
    });
  });
}
