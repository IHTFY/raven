// import * as Utils from './utils.js';

/**
 * Rules can be applied to a grid of cells. 
 * f([[1,2,3],  ==>  [[f(1),f(2),f(3)],
 *    [4,5,6],        [f(4),f(5),f(6)],
 *    [7,8,9]])       [f(7),f(8),f(9)]]
 * 
 * Rules should be commutative under composition,
 * at least with respect to the flattened image output.
 */

//TODO figure out how to structure these
export const constant = x => x;
export const increasing = x => x + 1;
export const decreasing = x => x - 1;