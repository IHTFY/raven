<script>
  import { onMount } from 'svelte';
  import { appear, slideUp } from '../motion.js';
  import Icon from './Icon.svelte';

  /** A panel that rises from the bottom, with a backdrop and a close button. `full` keeps it at its tallest. */
  let { title, full = false, onclose, children } = $props();

  let sheet;

  const focusable = () => [...sheet.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled);

  // The page behind stays in the tab order, so focus is kept inside the sheet until it closes, then returns to where it was.
  onMount(() => {
    const before = document.activeElement;
    sheet.focus({ preventScroll: true });
    return () => before?.isConnected && before.focus({ preventScroll: true });
  });

  function onkeydown(e) {
    if (e.key === 'Escape') return onclose();
    if (e.key !== 'Tab') return;
    const items = focusable();
    const first = items[0] ?? sheet;
    const last = items.at(-1) ?? sheet;
    const outside = !sheet.contains(document.activeElement) || document.activeElement === sheet;
    if (outside || (e.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }
</script>

<svelte:window {onkeydown} />

<div class="backdrop" transition:appear={{ duration: 180 }} onclick={onclose} aria-hidden="true"></div>
<div class="sheet" class:full bind:this={sheet} tabindex="-1" role="dialog" aria-modal="true" aria-label={title} in:slideUp={{ duration: 220 }} out:slideUp={{ duration: 160 }}>
  <header>
    <h2>{title}</h2>
    <button class="icon-btn" onclick={onclose} aria-label="Close"><Icon name="close" /></button>
  </header>
  <div class="body">{@render children()}</div>
</div>

<style>
  /* Both stop short of the ad beside the puzzles (PlayAd), so they never cover it. */
  .backdrop {
    position: fixed;
    inset: 0 var(--play-ad-right, 0px) 0 0;
    background: rgb(8 10 16 / 0.5);
    z-index: 10;
  }

  .sheet {
    position: fixed;
    inset: auto var(--play-ad-right, 0px) 0 0;
    z-index: 11;
    width: min(100% - var(--play-ad-right, 0px), 560px);
    max-height: 88dvh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 8px 16px calc(16px + env(safe-area-inset-bottom));
    background: var(--bg);
    border-radius: var(--radius) var(--radius) 0 0;
    box-shadow: 0 -8px 30px rgb(0 0 0 / 0.35);
  }

  .sheet:focus {
    outline: none;
  }

  .full {
    height: 88dvh;
  }

  header {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 52px;
  }

  h2 {
    font-size: 1.05rem;
    font-weight: 650;
  }

  .body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 6px 4px 4px;
  }
</style>
