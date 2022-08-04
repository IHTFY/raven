<script>
  import { onMount } from "svelte";
  import Cell from "./Cell.svelte";

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

<div class="question-text">
  <p>Which best follows the pattern?</p>
</div>
<div class="answers py-1">
  {#each choices as choice}
    <Cell config={choice.config} btn />
  {/each}
</div>

<style>
  .question-text {
    text-align: center;
    font-weight: 500;
    font-size: large;
  }

  .answers {
    aspect-ratio: 1.5;
    max-height: 30vh;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1em;
  }
</style>
