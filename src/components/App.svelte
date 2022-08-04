<script>
  // icon search
  // https://icon-sets.iconify.design/

  import Answers from "./Answers.svelte";
  import Grid from "./Grid.svelte";
  import Header from "./Header.svelte";
  import Pagination from "./Pagination.svelte";
  import Question from "./Question.svelte";

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
  // I guess I could use [fn1,fn2,fn3].reduce((g,f)=>f(g),grid)

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
  // e.g. modify the order applied functions, or add a random perturbation along the reduction,
  // and check that we don't have any duplicates - perhaps force property order and stringify
  // let wrong = [answer, answer, answer, answer, answer];
  let wrong = cells.flat().slice(0, 5);
</script>

<main>
  <Header />
  <div class="grix center">
    <Question>
      <Grid slot="grid" {cells} />
      <Answers slot="answers" {answer} {wrong} />
    </Question>
    <Pagination totalQuestions={35} />
  </div>
</main>

<style>
  main {
    height: 100vh;
  }
</style>
