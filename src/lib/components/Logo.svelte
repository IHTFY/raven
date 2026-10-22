<script>
  import { figure, shape, PAPER, INK, MID } from '../engine/draw.js';
  import { gridOf } from '../engine/grid.js';
  import Figure from './Figure.svelte';

  /**
   * A tiny puzzle: three shapes in a Latin square, the last one missing.
   * Tap it to see the answer, then a new puzzle slides in.
   */
  const SHAPES = ['circle', 'triangle', 'square', 'diamond', 'hexagon', 'star'];
  const FILLS = [INK, MID, PAPER];
  const draw = (name, k) => figure([shape(name, 30, FILLS[k], { width: 6 })]);

  let round = $state(0);
  let solved = $state(false);

  const trio = $derived([0, 1, 2].map((k) => SHAPES[(round + 2 * k) % SHAPES.length]));
  // Row r, column c holds shape (r + c) mod 3 and fill (r + 2c) mod 3, so every row and column has one of each.
  const cells = $derived(gridOf((r, c) => draw(trio[(r + c) % 3], (r + 2 * c) % 3)));

  function tap() {
    if (solved) return;
    solved = true;
    setTimeout(() => {
      solved = false;
      round += 1;
    }, 900);
  }
</script>

<button class="logo raised" onclick={tap} aria-label="Raven logo">
  {#each cells as cell, i (`${round}/${i}`)}
    <span class="cell" class:hidden={i === 8 && !solved} style:--i={i}><Figure figure={cell} /></span>
  {/each}
  {#if !solved}<span class="ask">?</span>{/if}
</button>

<style>
  .logo {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    width: 112px;
    height: 112px;
    padding: 12px;
    border-radius: 28px;
    transition: transform 140ms var(--ease-out);
  }

  .logo:active {
    transform: scale(0.96);
    transition-duration: 0ms;
  }

  .cell {
    animation: cell-in 220ms var(--ease-out) both;
    animation-delay: calc(var(--i) * 30ms);
    transition:
      opacity 160ms,
      transform 160ms var(--ease-out);
  }

  .hidden {
    opacity: 0;
    transform: scale(0.6);
  }

  .ask {
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: calc((100% - 32px) / 3);
    height: calc((100% - 32px) / 3);
    display: grid;
    place-items: center;
    color: var(--accent);
    font-weight: 700;
    font-size: 1.1rem;
  }

  @keyframes cell-in {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }
</style>
