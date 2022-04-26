<script>
  import Header from "./Header.svelte";
  import Grid from "./Grid.svelte";
  import Answers from "./Answers.svelte";

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
</script>

<Header />
<main class="container grix center">
  <Grid {cells} />
  <Answers {answer} {wrong} />
</main>
