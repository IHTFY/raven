/**
 * Transpose a grid in place.
 * 
 * @param {number[][]} grid a 2d matrix
 */
export const transpose = grid => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < i; j++) {
      [grid[i][j], grid[j][i]] = [grid[j][i], grid[i][j]];
    }
  }
}

/**
 * The range of % is (-n, n). positiveMode restricts the range to [0, n).
 * 
 * @param {number} x the number
 * @param {number} n the modulus
 * @returns {number} x mod n | x ϵ [0,n)
 */
const positiveMod = (x, n) => ((x % n) + n) % n;

// TODO TEST
/**
 * Rotate a grid clockwise in place.
 * 
 * @param {number[][]} grid a 2d matrix
 * @param {number} degrees the number of degrees to rotate clockwise (multiple of 90)
 * @returns {number[][]} the rotated matrix
 */
export const rotate = (grid, degrees = 90) => {
  if (!(grid % 90)) {
    console.error("rotate: degrees must be divisible by 90");
    return grid;
  }
  degrees = positiveMod(degrees, 360)
  while (degrees < 0) {
    transpose(grid);
    grid.forEach(row => row.reverse());
    degrees -= 90;
  }
}

// TODO might need to shallow copy using spread 
export const getRow = (grid, rowIndex) => grid[rowIndex];
export const getColumn = (grid, columnIndex) => grid.map(row => row[columnIndex]);

// export const getNeighborRight = (cell, loop = false, size = 3) = loop ? positiveMod(cell + 1, size) : cell + 1;
// export const getNeighborLeft = (cell, loop = false, size = 3) => loop ? positiveMod(cell - 1, size) : cell - 1;
// export const getNeighborUp = (cell, loop = false, size = 3) => loop ? positiveMod(cell - size, size * size) : cell - size;

/**
 * Modifies a row in place and returns the modified row.
 * 
 * @param {number[][]} grid a 2D array of cells
 * @param {0 | 1 | 2} rowIndex the row to which a rule will be applied 
 * @param {function} rule a function that will be mapped to a row
 * @returns the modified row, but the original grid is also modified in place
 */
export const applyToRow = (grid, rowIndex, rule) => {
  const row = grid[rowIndex];
  const newRow = row.map(rule);
  return grid.splice(rowIndex, 1, newRow);
};


/**
 * Modifies a column in place and returns the modified column.
 * 
 * @param {number[][]} grid grid of cells
 * @param {0 | 1 | 2} columnIndex the column to which a rule will be applied
 * @param {function} rule a function that will be mapped to a column
 * @returns the modified column, but the original grid is also modified in place
 */

export const applyToColumn = (grid, columnIndex, rule) => {
  transpose(grid);
  applyToRow(grid, columnIndex, rule);
  transpose(grid);
  return grid;
};

/**
 * Pick a diagonal from a grid.
 * 
 * @param {number[][]} grid 3x3 grid
 * @param {0 | 1 | 2} diagonalIndexcolumn index of first element
 * @param {-1 | 1} direction 1: right, -1: left
 * @returns {number[][]} array of elements in the diagonal, starting at the given index moving down and in the given direction
 *
 * 1 2 3  -1 -2 -3
 * 
 * 3 1 2  -2 -3 -1
 * 
 * 2 3 1  -3 -1 -2
 */

export const getDiagonal = (grid, diagonalIndex, direction) => {
  if (diagonalIndex < 0) {
    diagonalIndex = positiveMod(diagonalIndex, grid[0].length);
  }
  const output = [];
  for (let i = 0; i < grid.length; i++) {
    output.push(grid[i][positiveMod(diagonalIndex + direction * i, grid[i].length)]);
  }
  return output;
};