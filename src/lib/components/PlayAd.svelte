<script module>
  // Counts screens opened, so each gets its own key and so its own ad.
  let opened = 0;
</script>

<script>
  import { MediaQuery } from 'svelte/reactivity';
  import { PLAY_AD_SIZES, PLAY_AD_SLOT, mayBeAdFree, showAdAfterInput } from '../ads.js';

  /**
   * A test or practice screen with one ad beside it on wide windows, 150 px
   * from its buttons. The ad changes only when the screen opens or the window
   * crosses into another size, never on a timer.
   */
  let { name, children } = $props();

  // A buyer gets no box at all, even before the loader has checked the token.
  const buyer = mayBeAdFree();
  const queries = PLAY_AD_SIZES.map((p) => new MediaQuery(p.query));
  const placement = $derived(buyer ? undefined : PLAY_AD_SIZES.find((_, i) => queries[i].current));
  const [width, height] = $derived(placement?.size.split('x') ?? []);

  // Sheets stay 150 px left of the ad, so nothing covers it or crowds it with
  // buttons.
  let aside = $state();
  let box = $state();
  $effect(() => {
    if (!aside || !box) return;
    const root = document.documentElement;
    const track = () => {
      const px = root.clientWidth - box.getBoundingClientRect().left + 150;
      root.style.setProperty('--play-ad-right', `${Math.round(px)}px`);
    };
    const observer = new ResizeObserver(track);
    observer.observe(aside);
    addEventListener('resize', track);
    return () => {
      observer.disconnect();
      removeEventListener('resize', track);
      root.style.removeProperty('--play-ad-right');
    };
  });

  // A new box, so a new ad, each time this screen opens or the size changes.
  $effect(() => {
    if (box) showAdAfterInput(box, `${name}/${++opened}`);
  });
</script>

<div class="frame" class:side={placement}>
  <div class="play">{@render children()}</div>
  {#if placement}
    {#key placement.size}
      <aside class="ad" bind:this={aside}>
        <div class="row muted small">
          <p>Advertisements</p>
          <a href="https://ihtfy.com/privacy/">Privacy</a>
        </div>
        <div
          class="ad-box"
          bind:this={box}
          style:width="{width}px"
          style:height="{height}px"
          data-ad-slot={PLAY_AD_SLOT}
          data-ad-size={placement.size}
        ></div>
      </aside>
    {/key}
  {/if}
</div>

<style>
  .frame {
    height: 100%;
    display: grid;
    grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  }

  /* The play area keeps its own width limit; the rail sits 150 px past it. */
  .frame.side {
    grid-template-columns: minmax(0, 960px) auto;
    justify-content: center;
  }

  /*
   * The column is as wide as the ad; the label and links wrap above it on a
   * narrow rail. Game buttons sit at least 12 px inside the play area, so the
   * margin keeps the ad over 150 px from them.
   */
  .ad {
    display: grid;
    grid-template-columns: min-content;
    justify-content: center;
    align-content: start;
    gap: 4px;
    margin-left: 150px;
    padding: 8px 16px 0 0;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: 12px;
  }

  .small {
    font-size: 0.85rem;
  }
</style>
