/**
 * Six answer options. Each wrong option changes the answer along a few
 * independent axes, and the options form a balanced design: every value of
 * every feature appears equally often, so no option stands out as the one
 * the others are built around.
 *
 * - 3×2: a three-way axis times a two-way axis.
 * - cube: three two-way axes, all eight corners minus two opposite ones.
 *   The six left form a ring, so each looks like any other.
 * - line: six values of one attribute.
 */

import { figureKey } from './draw.js';
import { range, values } from './kinds.js';

const set = (attr, value) => (cell) => ({ ...cell, [attr.name]: value });
const flip = (attr, mask) => (cell) => ({ ...cell, [attr.name]: cell[attr.name] ^ mask });

/** Other values of a scalar attribute, the ones already in the grid first. */
function alternatives(attr, answer, visible, rng) {
  const others = values(attr).filter((v) => v !== answer);
  return [...rng.shuffle(others.filter((v) => visible.includes(v))), ...rng.shuffle(others.filter((v) => !visible.includes(v)))];
}

/** Up to three disjoint slot flips: drop a slot, add one seen in the grid, or swap the two. */
function toggles(attr, answer, visible, rng) {
  const seen = visible.reduce((m, v) => m | v, 0);
  const on = range(0, attr.size - 1).filter((i) => (answer >> i) & 1);
  const off = range(0, attr.size - 1).filter((i) => !((answer >> i) & 1));
  const offSeen = off.filter((i) => (seen >> i) & 1);
  const flips = [
    ...rng.shuffle([...on, ...offSeen].map((i) => 1 << i).concat(on.flatMap((i) => offSeen.map((j) => (1 << i) | (1 << j))))),
    ...rng.shuffle(off.filter((i) => !((seen >> i) & 1)).map((i) => 1 << i)),
  ];
  const chosen = [];
  let used = 0;
  for (const m of flips) {
    if (chosen.length === 3) break;
    if (m & used || (answer ^ m) === 0) continue;
    chosen.push(m);
    used |= m;
  }
  return chosen;
}

/** Take one item from each list in turn until all are empty. */
const interleave = (lists) => range(0, Math.max(0, ...lists.map((l) => l.length)) - 1).flatMap((k) => lists.flatMap((l) => (k < l.length ? [l[k]] : [])));

const apply = (cell, changes) => changes.reduce((c, f) => f(c), cell);

export function makeOptions(family, cells, varying, rng) {
  const answer = cells[8];
  const visible = (attr) => cells.slice(0, 8).map((c) => c[attr.name]);
  const isVarying = (a) => varying.has(a.name);

  const attempt = () => {
    const order = [...rng.shuffle(family.attrs.filter(isVarying)), ...rng.shuffle(family.attrs.filter((a) => !isVarying(a)))];
    const alts = new Map(
      order.filter((a) => a.kind !== 'set').map((a) => [a, alternatives(a, answer[a.name], visible(a), rng).map((v) => set(a, v))]),
    );
    // Two-way axes: one per scalar attribute, up to three per set. Varying attributes come first.
    const binary = (attrs) =>
      interleave(
        attrs.map((a) =>
          a.kind === 'set'
            ? toggles(a, answer[a.name], visible(a), rng).map((m) => ({ attr: a, changes: [flip(a, m)] }))
            : [{ attr: a, changes: alts.get(a).slice(0, 1) }],
        ),
      );
    const pool = [...binary(order.filter(isVarying)), ...binary(order.filter((a) => !isVarying(a)))];

    const designs = {
      grid32() {
        const wide = order.find((a) => alts.get(a)?.length >= 2);
        const other = wide && pool.find((axis) => axis.attr !== wide);
        if (!other) return null;
        const [x, y] = alts.get(wide);
        return [[], [x], [y]].flatMap((c) => [c, [...c, ...other.changes]]);
      },
      cube() {
        if (pool.length < 3) return null;
        const axes = pool.slice(0, 3).map((axis) => axis.changes[0]);
        const removed = rng.int(1, 6);
        return range(0, 7)
          .filter((b) => b !== removed && b !== 7 - removed)
          .map((b) => axes.filter((_, k) => (b >> k) & 1));
      },
      line() {
        const wide = order.find((a) => alts.get(a)?.length >= 5);
        return wide ? [[], ...alts.get(wide).slice(0, 5).map((f) => [f])] : null;
      },
    };

    const names = varying.size > 1 ? [...rng.shuffle(['grid32', 'cube']), 'line'] : rng.shuffle(Object.keys(designs));
    for (const name of names) {
      const combos = designs[name]();
      if (!combos) continue;
      const options = combos.map((changes) => apply(answer, changes));
      const fine = options.every((o) => family.attrs.every((a) => a.kind !== 'set' || o[a.name]) && (family.valid?.(o) ?? true));
      const keys = new Set(options.map((o) => figureKey(family.render(o))));
      if (fine && keys.size === options.length) {
        // combos[0] is always the answer itself.
        const shuffled = rng.shuffle(range(0, 5));
        return { options: shuffled.map((k) => options[k]), answer: shuffled.indexOf(0), design: name };
      }
    }
    return null;
  };

  for (let i = 0; i < 6; i++) {
    const out = attempt();
    if (out) return out;
  }
  return null;
}
