/**
 * Puzzle generation. A plan gives every attribute of a family one rule, and
 * its score estimates how hard the puzzle is. A test walks a target score
 * from easy to hard and picks a fitting plan for each question.
 */

import { makeOptions } from './choices.js';
import { figure } from './draw.js';
import { FAMILIES } from './families/index.js';
import { range } from './kinds.js';
import { createRng } from './rng.js';
import { RULES } from './rules.js';
import { determined } from './solver.js';

/** Bump whenever a change makes the same seed build different puzzles. */
export const GENERATOR = 2;
export const TEST_LENGTH = 35;
const TOLERANCE = 1.25;
/** Each extra changing attribute is one more thing to track. */
const PER_ATTRIBUTE = 0.75;

export const EASIEST = 1;
export const HARDEST = 8.5;
const target = (i) => EASIEST + ((HARDEST - EASIEST) * i) / (TEST_LENGTH - 1);

/** Every way to give each attribute a rule, leaving at least one attribute changing. */
function plansOf(family) {
  const choices = family.attrs.map((attr) => RULES.filter((rule) => rule.applies(attr)));
  const combos = choices.reduce((acc, rules) => acc.flatMap((plan) => rules.map((rule) => [...plan, rule])), [[]]);
  return combos.flatMap((rules) => {
    const varying = rules.filter((rule) => rule.id !== 'constant');
    if (!varying.length) return [];
    const score = family.base + varying.reduce((s, rule) => s + rule.score, 0) + PER_ATTRIBUTE * (varying.length - 1);
    return [{ family, rules, score }];
  });
}

const PLANS = FAMILIES.flatMap(plansOf);

/** Plans where every changing attribute only repeats along rows or columns. A test uses them only for its easiest target. */
const repeatsOnly = (plan) => plan.rules.every((rule) => ['constant', 'rows', 'cols'].includes(rule.id));
const TEST_PLANS = PLANS.filter((plan) => !repeatsOnly(plan));

/** Pick a group other than the last one, then a family in it, then a plan near the target. */
function choosePlan(plans, goal, rng, avoid) {
  const gap = (plan) => Math.abs(plan.score - goal);
  const reach = Math.min(...plans.map(gap)) + TOLERANCE;
  const near = plans.filter((plan) => gap(plan) <= reach);
  const groups = [...new Set(near.map((plan) => plan.family.group))];
  const fresh = groups.filter((g) => g !== avoid);
  const group = rng.pick(fresh.length ? fresh : groups);
  const family = rng.pick([...new Set(near.filter((plan) => plan.family.group === group).map((plan) => plan.family))]);
  return rng.weighted(
    near.filter((plan) => plan.family === family),
    (plan) => 1 / (0.5 + gap(plan)),
  );
}

/** Fill the grid for one attribute until the solver agrees the answer is forced. */
function fill(rule, attr, rng) {
  for (let i = 0; i < 25; i++) {
    const made = rule.make(attr, rng);
    if (made && determined(attr, made.grid)) return made;
  }
  return null;
}

/**
 * People also notice links between attributes ("the black ones are always
 * big"). Wherever the visible cells tie one attribute's value to another's,
 * the answer must keep the tie.
 */
function keepsLinks(family, cells) {
  const answer = cells[8];
  const keeps = (a, b) => {
    const link = new Map();
    for (const cell of cells.slice(0, 8)) {
      if (link.has(cell[a.name]) && link.get(cell[a.name]) !== cell[b.name]) return true;
      link.set(cell[a.name], cell[b.name]);
    }
    return !link.has(answer[a.name]) || link.get(answer[a.name]) === answer[b.name];
  };
  return family.attrs.every((a) => family.attrs.every((b) => a === b || keeps(a, b)));
}

function build({ family, rules, score }, rng) {
  const made = [];
  for (const [k, attr] of family.attrs.entries()) {
    const m = fill(rules[k], attr, rng);
    if (!m) return null;
    made.push(m);
  }
  const cells = range(0, 8).map((i) => Object.fromEntries(family.attrs.map((attr, k) => [attr.name, made[k].grid[i]])));
  if ((family.valid && !cells.every(family.valid)) || !keepsLinks(family, cells)) return null;

  const varying = family.attrs.filter((_, k) => rules[k].id !== 'constant');
  const choices = makeOptions(family, cells, new Set(varying.map((attr) => attr.name)), rng);
  if (!choices) return null;

  const draw = (cell) => figure(family.render(cell));
  return {
    family: family.id,
    group: family.group,
    name: family.name,
    score,
    cells,
    options: choices.options,
    answer: choices.answer,
    design: choices.design,
    figures: { cells: cells.slice(0, 8).map(draw), options: choices.options.map(draw) },
    rules: family.attrs.flatMap((attr, k) =>
      rules[k].id === 'constant' ? [] : [{ attr: attr.name, rule: rules[k].id, text: rules[k].explain(attr, made[k].params) }],
    ),
  };
}

function puzzleFrom(plans, seed, goal, avoid) {
  const rng = createRng(seed);
  for (let i = 0; i < 200; i++) {
    const plan = choosePlan(plans, goal, rng, avoid);
    for (let j = 0; j < 4; j++) {
      const puzzle = build(plan, rng);
      if (puzzle) return { seed, target: goal, ...puzzle };
    }
  }
  throw new Error(`No puzzle found for seed ${seed}`);
}

/** One puzzle near a target difficulty. The same seed and target always give the same puzzle. */
export const generatePuzzle = (seed, goal, avoid) => puzzleFrom(PLANS, seed, goal, avoid);

/**
 * Order by score, then pull forward the next puzzle from a different group
 * wherever two neighbors share one, so the test keeps switching styles.
 * Same-group puzzles left at the end move back to the latest gap between two
 * other groups, a little out of score order.
 */
function arrange(puzzles) {
  const out = [...puzzles].sort((a, b) => a.score - b.score);
  for (let i = 1; i < out.length; i++) {
    if (out[i].group !== out[i - 1].group) continue;
    const j = out.findIndex((p, k) => k > i && p.group !== out[i - 1].group);
    if (j > 0) out.splice(i, 0, ...out.splice(j, 1));
  }
  // Near the end one group can be all that's left; move those back between two other groups.
  for (let i = out.length - 1; i > 0; i--) {
    const group = out[i].group;
    if (group !== out[i - 1].group) continue;
    const k = out.findLastIndex((p, m) => m > 0 && m < i - 1 && p.group !== group && out[m - 1].group !== group);
    if (k < 0) continue;
    out.splice(k, 0, ...out.splice(i, 1));
    i++; // Check this index again: the run of one group may be longer.
  }
  return out;
}

/** A full test, easiest first, with at most one puzzle that just repeats along rows or columns. */
export function generateTest(seed) {
  let previous;
  const puzzles = range(0, TEST_LENGTH - 1).map((i) => {
    const puzzle = puzzleFrom(i ? TEST_PLANS : PLANS, `${seed}/${i}`, target(i), previous);
    previous = puzzle.group;
    return puzzle;
  });
  return arrange(puzzles);
}
