<script module>
  // Counts screens opened, so each gets its own key and so its own ad.
  let opened = 0;
</script>

<script>
  import { PLAY_AD_SIZES, PLAY_AD_SLOT, mayBeAdFree, showPlayAd } from '../ads.js';

  /**
   * A test or practice screen with one ad beside it (wide screens) or below it
   * (tall phones), 150 px from its buttons. The ad changes only when the
   * screen opens or the window crosses into another size, never on a timer.
   */
  let { name, children } = $props();

  // A buyer gets no box at all, even before the loader has checked the token.
  const buyer = mayBeAdFree();
  const pick = () => (buyer ? null : (PLAY_AD_SIZES.find((p) => matchMedia(p.query).matches) ?? null));
  let placement = $state(pick());

  $effect(() => {
    const lists = PLAY_AD_SIZES.map((p) => matchMedia(p.query));
    const update = () => (placement = pick());
    for (const list of lists) list.addEventListener('change', update);
    return () => lists.forEach((list) => list.removeEventListener('change', update));
  });

  // Sheets and toasts stop above the band, so nothing covers the ad.
  let aside = $state();
  $effect(() => {
    if (placement?.at !== 'bottom' || !aside) return;
    const root = document.documentElement.style;
    const track = () => root.setProperty('--play-ad-bottom', `${aside.offsetHeight}px`);
    const observer = new ResizeObserver(track);
    observer.observe(aside);
    return () => {
      observer.disconnect();
      root.removeProperty('--play-ad-bottom');
    };
  });

  // A new box, so a new ad, each time this screen opens or the size changes.
  let box = $state();
  $effect(() => {
    if (box && placement) showPlayAd(box, `${name}/${++opened}`);
  });
</script>

<div class="frame {placement?.at ?? ''}">
  <div class="play">{@render children()}</div>
  {#if placement}
    {#key placement.size}
      <aside class="ad" bind:this={aside}>
        <div class="row muted small">
          <p>Advertisements</p>
          <a href="https://ihtfy.com/privacy">Privacy</a>
        </div>
        <div class="ad-box size-{placement.size}" bind:this={box} data-ad-slot={PLAY_AD_SLOT} data-ad-size={placement.size}></div>
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

  .frame.bottom {
    grid-template-rows: minmax(0, 1fr) auto;
  }

  /* The column is as wide as the ad; the label and links wrap above it on a narrow rail. */
  .ad {
    display: grid;
    grid-template-columns: min-content;
    justify-content: center;
    align-content: start;
    gap: 4px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: 12px;
  }

  /* Game buttons sit at least 12 px inside the play area, so these gaps keep the ad over 150 px from them. */
  .side .ad {
    margin-left: 150px;
    padding: 8px 16px 0 0;
  }

  .bottom .ad {
    padding: 118px 0 6px;
  }

  .small {
    font-size: 0.85rem;
  }

  .size-320x50 {
    width: 320px;
    height: 50px;
    min-height: 50px;
  }

  .size-160x600 {
    width: 160px;
    height: 600px;
    min-height: 600px;
  }

  .size-300x600 {
    width: 300px;
    height: 600px;
    min-height: 600px;
  }
</style>
