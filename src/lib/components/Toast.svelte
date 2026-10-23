<script>
  import { rise } from '../motion.js';

  /**
   * A short message near the bottom, or near the top with `top` (on Results, so
   * it never covers the ad). Set `message` to show it; it clears itself.
   */
  let { message = $bindable(null), top = false } = $props();

  $effect(() => {
    if (!message) return;
    const id = setTimeout(() => (message = null), 2200);
    return () => clearTimeout(id);
  });
</script>

{#if message}
  <div class="toast raised" class:top role="status" transition:rise={{ y: top ? -16 : 16 }}>{message}</div>
{/if}

<style>
  .toast {
    position: fixed;
    left: 50%;
    bottom: calc(24px + env(safe-area-inset-bottom));
    translate: -50% 0;
    z-index: 20;
    padding: 12px 18px;
    border-radius: 999px;
    font-weight: 600;
    white-space: nowrap;
  }

  .top {
    top: calc(24px + env(safe-area-inset-top));
    bottom: auto;
  }
</style>
