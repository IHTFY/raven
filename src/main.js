import { mount } from 'svelte';
import App from './App.svelte';
import { loadForBuyer } from './lib/ads.js';
import './app.css';

loadForBuyer();
mount(App, { target: document.getElementById('app') });
