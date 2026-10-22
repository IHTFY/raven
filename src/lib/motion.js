import { prefersReducedMotion } from 'svelte/motion';
import { fade, fly, scale } from 'svelte/transition';

const still = (params) => (prefersReducedMotion.current ? { ...params, duration: 0, delay: 0 } : params);

/** Svelte transitions that respect the reduced-motion setting. */
export const rise = (node, params) => fly(node, still({ y: 12, duration: 180, ...params }));
export const pop = (node, params) => scale(node, still({ start: 0.85, duration: 160, ...params }));
export const appear = (node, params) => fade(node, still({ duration: 160, ...params }));
export const slideUp = (node, params) => fly(node, still({ y: '100%', opacity: 1, ...params }));
