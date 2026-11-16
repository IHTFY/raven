<script module>
  // Counts boxes opened, so each screen visit gets its own key and so its own ad.
  let opened = 0;
</script>

<script>
  import { adSizesFor, screenAdSlot, showAdAfterInput } from '../ads.js';

  /**
   * The ad on a screen where no game is in progress, or nothing when the screen
   * gets none. The box has a fixed size, the largest that leaves it in the first
   * screen when the screen opens, so nothing shifts when the ad fills it, and
   * no box at all when even the smallest doesn't fit. The size is never picked
   * again: a window that later changes shape hides the box while it doesn't fit
   * and brings it back when it does, and never asks for another ad. `adKey`
   * names what the ad is for (a finished test); the Privacy and Remove ads links
   * sit 50 px above the box, like the buttons on the screen. `shown` tells the
   * screen whether the box, and so its Privacy link, is on view right now.
   */
  let { screen, adKey = null, shown = $bindable(false) } = $props();

  // The screen never changes while the box is on it.
  // svelte-ignore state_referenced_locally
  const slot = screenAdSlot(screen);
  // svelte-ignore state_referenced_locally
  const candidates = slot ? adSizesFor(screen) : [];
  // svelte-ignore state_referenced_locally
  const key = adKey ?? `${screen}/${++opened}`;

  // Starts as the largest size, which the first measurement may replace.
  let size = $state(candidates[0]);
  const [width, height] = $derived(size?.split('x') ?? []);

  let aside = $state();
  let box = $state();

  // The aside stretches across its screen, so the box's own bounds are checked too: a box wider than the
  // room overflows the aside and the window, and sits inside the aside's padding when it fits.
  const fits = () => {
    const { bottom, left, right } = aside.getBoundingClientRect();
    const { paddingLeft, paddingRight } = getComputedStyle(aside);
    const inner = {
      left: left + (parseFloat(paddingLeft) || 0),
      right: right - (parseFloat(paddingRight) || 0),
    };
    const own = box.getBoundingClientRect();
    return (
      bottom <= innerHeight &&
      left >= 0 &&
      right <= innerWidth &&
      own.left >= Math.max(0, inner.left) &&
      own.right <= Math.min(innerWidth, inner.right)
    );
  };

  let picked = false;
  $effect(() => {
    if (!aside || !box || picked) return;
    picked = true;
    const best = candidates.find((candidate) => {
      const [w, h] = candidate.split('x');
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      return fits();
    });
    size = best;
    shown = best !== undefined;
    if (best) showAdAfterInput(box, key);
  });

  // The display is set here, not in the markup: the box must be on the page, however briefly, to be measured.
  function refit() {
    if (!aside || !picked) return;
    aside.style.display = '';
    shown = fits();
    aside.style.display = shown ? '' : 'none';
  }
</script>

<svelte:window onresize={refit} />

{#if size}
  <aside class="ad" bind:this={aside}>
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
