<script>
  import { rise } from '../motion.js';

  /** A short message near the bottom. Set `message` to show it; it clears itself. */
  let { message = $bindable(null) } = $props();

  $effect(() => {
    if (!message) return;
    const id = setTimeout(() => (message = null), 2200);
    return () => clearTimeout(id);
  });
</script>

{#if message}
  <div class="toast raised" role="status" transition:rise={{ y: 16 }}>{message}</div>
{/if}

<style>
  .toast {
    position: fixed;
    left: 50%;
    bottom: calc(24px + var(--play-ad-bottom, 0px) + env(safe-area-inset-bottom));
    translate: -50% 0;
    z-index: 20;
    padding: 12px 18px;
    border-radius: 999px;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
