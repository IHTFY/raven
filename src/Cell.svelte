<script>
  import * as Rules from "./rules.js";
  import Graphics from "./Graphics.svelte";
  export let config;
  export let btn = false;
</script>

<div
  class="cell neu-bordered rounded-2"
  class:btn
  data-neu-click={btn ? "neu-pressed" : "neu-bordered"}
>
  <Graphics {config} />
</div>

<style>
  .cell {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
  }
  /* override neu btn padding */
  .btn {
    padding: 0px;
  }
</style>
