<script>
  import * as Axentix from "axentix";
  import { onMount } from "svelte";

  onMount(() => {
    let slides = new Axentix.Caroulix("#slides", {
      autoplay: {
        enabled: false,
      },
      indicators: {
        enabled: true,
        isFlat: true,
      },
    });
  });
</script>

<div class="grix center">
  <div class="caroulix" id="slides">
    <div class="caroulix-arrow caroulix-prev"><span>‹</span></div>
    <div class="caroulix-arrow caroulix-next"><span>›</span></div>
    <div class="caroulix-item grix center">
      <slot />
    </div>
    <div class="caroulix-item grix center">
      <slot />
    </div>
    <div class="caroulix-item grix center">
      <slot />
    </div>
  </div>
</div>

<style>
  .grix {
    height: calc(100vh - 56px);
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
  }
  :global(.caroulix .caroulix-indicators) {
    bottom: 0px;
  }
</style>
