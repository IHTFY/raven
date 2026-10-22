<script>
  import Choices from './Choices.svelte';
  import Matrix from './Matrix.svelte';

  /**
   * The puzzle and its options, sized to fill whatever space the screen
   * leaves: stacked in portrait, side by side when the space is wide.
   */
  let { puzzle, chosen = null, revealed = false, onchoose } = $props();
</script>

<div class="board">
  <div class="fit">
    <Matrix {puzzle} fill={revealed ? puzzle.answer : chosen} />
    <Choices {puzzle} {chosen} {revealed} {onchoose} />
  </div>
</div>

<style>
  .board {
    flex: 1;
    min-height: 0;
    container-type: size;
    display: grid;
    place-items: center;
  }

  /*
   * Portrait: the matrix is 3.12 cells square and the options 1.82 cells
   * tall, so the stack is 4.94 cells plus the gap.
   */
  .fit {
    --cell: min((100cqw - 16px) / 3.12, (100cqh - 40px) / 4.94, 150px);
    --option: calc(var(--cell) * 0.86);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  /* Wide: options go in two columns beside the matrix, 4.94 cells across. */
  @container (min-aspect-ratio: 5 / 4) {
    .fit {
      --cell: min((100cqw - 56px) / 4.94, (100cqh - 16px) / 3.12, 160px);
      --option-columns: 2;
      flex-direction: row;
      gap: 32px;
    }
  }
</style>
