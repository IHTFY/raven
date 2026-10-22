/**
 * A puzzle grid is a flat array of 9 values in reading order.
 * Cell 8 (bottom right) is the one the player fills in.
 */

export const MISSING = 8;
const row = (i) => Math.floor(i / 3);
const col = (i) => i % 3;
const at = (r, c) => 3 * r + c;

export const gridOf = (fn) => Array.from({ length: 9 }, (_, i) => fn(row(i), col(i)));

/**
 * Ways to split the grid into three lines of three cells, each line ordered
 * top to bottom (or left to right). The diagonals wrap around, which is how
 * Latin squares repeat. The missing cell is always last in the last line.
 */
export const SYSTEMS = {
  rows: [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
  cols: [[0, 3, 6], [1, 4, 7], [2, 5, 8]],
  down: [[1, 5, 6], [2, 3, 7], [0, 4, 8]], // ↘ diagonals: column − row is constant
  up: [[0, 5, 7], [2, 4, 6], [1, 3, 8]], // ↙ diagonals: column + row is constant
};

/** Grid symmetries that map the missing cell onto a visible one, as cell permutations. */
export const MIRRORS = {
  leftRight: gridOf((r, c) => at(r, 2 - c)),
  topBottom: gridOf((r, c) => at(2 - r, c)),
  halfTurn: gridOf((r, c) => at(2 - r, 2 - c)),
  antiDiagonal: gridOf((r, c) => at(2 - c, 2 - r)),
};
