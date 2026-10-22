<script>
  import { pop } from '../motion.js';
  import Figure from './Figure.svelte';

  /** The 3×3 puzzle. `fill` puts an option in the missing cell. */
  let { puzzle, fill = null } = $props();
</script>

<div class="matrix raised" role="img" aria-label="Puzzle: eight pictures and a missing ninth">
  {#each puzzle.figures.cells as figure, i (i)}
    <div class="cell" style:--i={i}><Figure {figure} /></div>
  {/each}
  <div class="cell missing" style:--i={8}>
    {#if fill == null}
      <span class="slot sunk">?</span>
    {:else}
      {#key fill}
        <div class="placed" in:pop><Figure figure={puzzle.figures.options[fill]} /></div>
      {/key}
    {/if}
  </div>
</div>

<style>
  .matrix {
    display: grid;
    grid-template-columns: repeat(3, var(--cell));
    grid-template-rows: repeat(3, var(--cell));
    padding: calc(var(--cell) * 0.06);
    border-radius: calc(var(--cell) * 0.16);
  }

  .cell {
    position: relative;
    padding: calc(var(--cell) * 0.08);
    animation: cell-in 260ms var(--ease-out) both;
    animation-delay: calc(var(--i) * 28ms);
  }

  /* Hairlines between cells. */
  .cell:not(:nth-child(3n + 1)) {
    border-left: 1px solid var(--line);
  }
  .cell:nth-child(n + 4) {
    border-top: 1px solid var(--line);
  }

  .missing {
    display: grid;
    place-items: center;
    transition: box-shadow 160ms;
    border-radius: 0 0 calc(var(--cell) * 0.12) 0;
  }

  .slot {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: calc(var(--cell) * 0.12);
    color: var(--muted);
    font-size: calc(var(--cell) * 0.34);
    font-weight: 600;
  }

  .placed {
    width: 100%;
    height: 100%;
  }

  @keyframes cell-in {
    from {
      opacity: 0;
      transform: scale(0.94);
    }
  }
</style>
