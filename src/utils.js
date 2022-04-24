/**
 * Transpose a grid in place.
 * 
 * @param {a 2d matrix} grid 
 */
export const transpose = grid => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < i; j++) {
      [grid[i][j], grid[j][i]] = [grid[j][i], grid[i][j]];
    }
  }
}

/**
 * Rotate a grid clockwise in place.
 *
 * @param {a 2d matrix} grid
 * @returns {a 2d matrix}
 */
// TODO TEST
export const rotate = (grid, degrees = 90) => {
  if (!(grid % 90)) {
    console.error("rotate: degrees must be divisible by 90");
    return grid;
  }
  degrees %= 360;
  while (degrees < 0) {
    transpose(grid);
    grid.forEach(row => row.reverse());
    degrees -= 90;
  }
}

/**
 * The range of % is (-n, n). positiveMode restricts the range to [0, n).
 * 
 * @param {a value} x 
 * @param {the modulus} n 
 * @returns x mod n | x ϵ [0,n)
 */
const positiveMod = (x, n) => ((x % n) + n) % n;

// TODO might need to shallow copy using spread 
export const getRow = (grid, rowIndex) => grid[rowIndex];
export const getColumn = (grid, columnIndex) => grid.map(row => row[columnIndex]);

// export const getNeighborRight = (cell, loop = false, size = 3) = loop ? positiveMod(cell + 1, size) : cell + 1;
// export const getNeighborLeft = (cell, loop = false, size = 3) => loop ? positiveMod(cell - 1, size) : cell - 1;
// export const getNeighborUp = (cell, loop = false, size = 3) => loop ? positiveMod(cell - size, size * size) : cell - size;

/**
 * Modifies a row in place and returns the modified row.
 * 
 * @param {a 2D array of cells} grid 
 * @param {the row to which a rule will be applied} rowIndex 
 * @param {a function that will be mapped to a row} rule 
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
 * @param {grid of cells} grid
 * @param {the column to which a rule will be applied} columnIndex
 * @param {a function that will be mapped to a column} rule
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
 * @param {3x3 grid} grid
 * @param {column index of first element} diagonalIndex
 * @param {1: right, -1: left} direction
 * @returns {array of elements in the diagonal, starting at the given index moving down and in the given direction}
 */

/**
 * 1 2 3  -1 -2 -3
 * 3 1 2  -2 -3 -1
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