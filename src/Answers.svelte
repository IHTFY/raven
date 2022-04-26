<script>
  import Cell from "./Cell.svelte";
  import { onMount } from "svelte";

  export let answer;
  export let wrong;

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const choices = shuffle([answer, ...wrong]);

  // let config = {
  //   grid: {
  //     fill: "rect",
  //     placement: [
  //       {
  //         // x: col,
  //         // y: row,
  //         x: 1,
  //         y: 2,
  //       },
  //     ],
  //   },
  // };

  onMount(() => {
    document.querySelectorAll(".answers .cell").forEach((cell, i) => {
      cell.addEventListener("click", () => {
        console.log(`clicked ${i}`);
      });
    });
  });
</script>

Which best follows the pattern?

<div class="answers py-1">
  {#each choices as choice}
    <Cell config={choice.config} btn />
  {/each}
</div>

<style>
  .answers {
    aspect-ratio: 2;
    max-height: 33.333vh;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1em;
  }
</style>
