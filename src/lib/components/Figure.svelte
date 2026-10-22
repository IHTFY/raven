<script>
  /** One figure from the engine: SVG paths in a 100×100 box. */
  let { figure } = $props();
</script>

<svg viewBox="0 0 100 100" aria-hidden="true">
  {#each figure.paths as p, i (i)}
    <path d={p.d} class="f-{p.fill} s-{p.stroke}" stroke-width={p.width} />
  {/each}
</svg>

<style>
  svg {
    display: block;
    width: 100%;
    height: 100%;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>
