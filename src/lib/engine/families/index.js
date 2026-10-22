import { counts, nested, shapes, tally } from './figures.js';
import { pointers } from './pointers.js';
import { sets } from './sets.js';

export const FAMILIES = [shapes, counts, tally, nested, ...pointers, ...sets];
