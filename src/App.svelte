<script>
  import Grid from "./Grid.svelte";
  import Answers from "./Answers.svelte";
  import { theme } from "./stores.js";

  let cells = [
    [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ],
    [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ],
    [
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  ];

  // TODO the grid should be mapped through an array of functions,
  // and the final output should be the grid of cells with row, col, and config
  // the config shouldn't have logic, just the static description of the graphic

  // apply rules to each cell
  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      let cell = cells[row][col];

      // specify how to render the cell
      cell.config = {
        grid: {
          fill: "rect",
          placement: [
            {
              x: cell.col,
              y: cell.row,
            },
          ],
        },
      };
    }
  }

  let answer = cells[cells.length - 1].pop();

  // TODO generate plausible wrong answers
  let wrong = [answer, answer, answer, answer, answer, answer, answer];

  // get theme from localStorage or use light by default
  theme.set(localStorage.getItem("theme") ?? "neu-light");

  // update localStorage and html class whenever the theme writable changes
  theme.subscribe((current) => {
    localStorage.setItem("theme", current);
    document.documentElement.classList.remove("neu-light", "neu-dark");
    document.documentElement.classList.add(current);
  });
</script>

<main>
  <button
    class="btn rounded-1 neu-concave neu-small"
    data-neu-click="neu-pressed"
    on:click={() => {
      theme.update((current) =>
        current === "neu-light" ? "neu-dark" : "neu-light"
      );
    }}
  >
    DARK MODE
  </button>
  <Grid {cells} />
  <Answers {answer} {wrong} />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
