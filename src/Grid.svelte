<script>
  import Cell from "./Cell.svelte";

  export let cells;
</script>

<div class="grid">
  {#each cells as row}
    {#each row as cell}
      <Cell config={cell.config} />
    {/each}
  {/each}
  <div class="missing neu-pressed rounded-2">?</div>
</div>

<style>
  .grid {
    width: 600px;
    height: 600px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 1em;
    user-select: none;
  }

  .missing {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    font-size: 7rem;
  }
</style>
