<script>
  import { theme } from "../stores.js";

  // update color based on theme
  let same;
  let contrast;

  $: [same, contrast] =
    $theme === "neu-light" ? ["#e5e5e5", "#222"] : ["#222", "#e5e5e5"];

  export let config;
</script>

<svg>
  {#if config.grid}
    <rect
      width="100%"
      height="100%"
      fill="none"
      stroke={contrast}
      stroke-width="4%"
    />
    <line
      x1="33.333%"
      y1="0%"
      x2="33.333%"
      y2="100%"
      stroke={contrast}
      stroke-width="2%"
    />
    <line
      x1="66.666%"
      y1="0%"
      x2="66.666%"
      y2="100%"
      stroke={contrast}
      stroke-width="2%"
    />
    <line
      x1="0%"
      y1="33.333%"
      x2="100%"
      y2="33.333%"
      stroke={contrast}
      stroke-width="2%"
    />
    <line
      x1="0%"
      y1="66.666%"
      x2="100%"
      y2="66.666%"
      stroke={contrast}
      stroke-width="2%"
    />
    {#each config.grid.placement as coords}
      {#if config.grid.fill === "rect"}
        <rect
          x={`${coords.x * 33.333}%`}
          y={`${coords.y * 33.333}%`}
          width="33.333%"
          height="33.333%"
          stroke={contrast}
          fill={contrast}
        />
      {/if}
    {/each}
  {:else if (config.nested = "nested")}
    <!-- TODO allow arbitrary number of layers-->
    <!-- outer -->
    <rect width="" />
    <!-- inner -->
    <rect />
  {/if}
</svg>

<style>
  svg {
    padding: 10%;
    width: 100%;
    height: 100%;
  }
</style>
