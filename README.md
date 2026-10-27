# raven

A website that generates puzzles in the style of [Raven's Progressive Matrices](https://en.wikipedia.org/wiki/Raven's_Progressive_Matrices): a 3×3 grid of pictures with the last one missing, and six options to choose from.

Inspired by [Olav Hoel Dørum's test](https://test.mensa.no/) and the [Sandia Matrices](https://link.springer.com/content/pdf/10.3758/BRM.42.2.525.pdf).

## Features

- **Test:** 35 puzzles in 25 minutes, easiest first. The test comes from a short code in the link, so sharing the link gives someone else the same puzzles. Results split the score into easy, medium, and hard thirds, and every puzzle can be reviewed with an explanation.
- **Past tests:** the last 100 finished tests are kept with their answers, and each opens its results and explanations again (`#/history`).
- **Practice:** puzzles without end or a timer. They get harder after a right answer and easier after a miss, and "Why?" explains the rules behind each one.
- **Explanations you can watch:** every rule in an explanation also plays as a short animation: lines lighting up, arrows labelled with each step, two pictures merging into the third with the dropped parts fading out, or a picture turning onto its neighbor (`src/lib/explain.js`, `Demo.svelte`).
- Dark and light themes, keyboard controls (1–6 or A–F to answer, arrow keys to move between puzzles), and progress saved in the browser.

## How puzzles are made

Everything lives in `src/lib/engine`. A puzzle is a family of pictures plus one rule for each of the family's attributes.

- **Families** (`families/`) say what a picture is made of. Some have a few attributes with a handful of values each: shapes (shape, size, shading), counts, tallies, nested shapes, umbrellas, angles, and clocks. Others are sets of parts that can each be on or off: tiles, marks, lines, spokes, and parts.
- **Rules** (`rules.js`) fill the grid for one attribute:
  - the same everywhere, or the same along each row or column;
  - each value once per row and column, with each row shifted one place, so the values run along the diagonals going down or up;
  - a progression that steps one way going right and another going down;
  - the third picture as the sum or difference of the first two;
  - set rules: union, intersection, exclusive or, and subtraction of the first two pictures; each part appearing in exactly one or exactly two pictures per row; parts moving one place per step; each part following its own direction; and a row group laid over a column group.
- **The solver** (`solver.js`) checks each grid without knowing how it was made. It tries every hypothesis a person might (rows, columns, both diagonals, progressions, sums, set operations, counts) and keeps the puzzle only if every hypothesis that fits the eight visible pictures predicts the same missing one. Ties between attributes ("the black ones are always big") have to hold for the answer too.
- **Options** (`choices.js`): the five wrong options change the answer along balanced axes, so every value of every feature appears equally often and the answer never stands out as the option the others were built from.
- **Difficulty** (`generate.js`): each rule has a score, and a puzzle's score adds the family's base, its rules, and a cost for each extra attribute that changes. The scores are tuned so that puzzles rank in roughly the order the Mensa Norway test places similar ones, with set logic (XOR, AND, splitting a set across a row) in the last third. A test aims for scores from 1 up to 8.5, avoids two puzzles of the same style in a row, and allows only the first question to be one where each row (or each column) is a single picture repeated.

## Not an IQ test

The puzzles haven't been normed against a population, so a score can't be turned into an IQ. Answers stay in your browser.

## Development

```sh
pnpm install
pnpm dev        # local server with hot reload
pnpm test       # engine tests
pnpm check      # tests, then a production build
pnpm ghdeploy   # build and publish dist/ to GitHub Pages
```
