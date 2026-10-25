<script module>
  // Counts boxes opened, so each screen visit gets its own key and so its own ad.
  let opened = 0;
</script>

<script>
  import { MediaQuery } from 'svelte/reactivity';
  import { SCREEN_AD_SIZES, screenAdSlot, showAdAfterInput } from '../ads.js';

  /**
   * The ad on a screen where no game is in progress, or nothing when the screen
   * gets none. The box has a fixed size, picked from the window when the screen
   * opens or the window crosses into another size, so nothing shifts when the ad
   * fills it. `adKey` names what the ad is for (a finished test); the Privacy and
   * Remove ads links sit 50 px above the box, like the buttons on the screen.
   */
  let { screen, adKey = null } = $props();

  // The screen never changes while the box is on it.
  // svelte-ignore state_referenced_locally
  const slot = screenAdSlot(screen);
  // svelte-ignore state_referenced_locally
  const sizes = SCREEN_AD_SIZES[screen] ?? [];
  const queries = sizes.map((s) => new MediaQuery(s.query));
  const size = $derived(sizes.find((_, i) => queries[i].current)?.size);
  const [width, height] = $derived(size?.split('x') ?? []);

  let box = $state();
  $effect(() => {
    if (box) showAdAfterInput(box, `${adKey ?? `${screen}/${++opened}`}/${size}`);
  });
</script>

{#if slot && size}
  <!-- A new box, so a new ad, when the size changes. -->
  {#key size}
    <aside class="ad">
      <p class="links muted small"><a href="https://ihtfy.com/privacy/">Privacy</a></p>
      <p class="muted small">Advertisements</p>
      <div
        class="ad-box"
        bind:this={box}
        style:width="{width}px"
        style:height="{height}px"
        data-ad-slot={slot}
        data-ad-size={size}
      ></div>
    </aside>
  {/key}
{/if}

<style>
  .ad {
    display: grid;
    justify-items: center;
    gap: 4px;
    padding: var(--ad-padding, 0);
  }

  /* The links are 50 px or more above the box whatever the label's height. The loader adds Remove ads beside Privacy, so the row has room for both and Privacy doesn't move. */
  .links {
    margin-bottom: 48px;
    width: 11em;
    text-align: left;
  }

  a {
    padding: 4px;
  }

  .small {
    font-size: 0.85rem;
  }
</style>
