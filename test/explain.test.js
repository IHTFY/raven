import { describe, expect, it } from 'vitest';
import { figure, figureKey, rotate } from '../src/lib/engine/draw.js';
import { FAMILIES } from '../src/lib/engine/families/index.js';
import { EASIEST, HARDEST, generatePuzzle } from '../src/lib/engine/generate.js';
import { mod, range } from '../src/lib/engine/kinds.js';
import { RULES } from '../src/lib/engine/rules.js';
import { demoOf, motionOf } from '../src/lib/explain.js';

const FAMILY = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
const SAMPLE = range(0, 599).map((i) => generatePuzzle(`explain/${i}`, EASIEST + ((HARDEST - EASIEST) * (i % 20)) / 19));
const RULE_IDS = RULES.map((r) => r.id).filter((id) => id !== 'constant');

/** Every rule of every sampled puzzle, with its demo. */
const cases = SAMPLE.flatMap((puzzle) => puzzle.rules.map((rule) => ({ puzzle, rule, demo: demoOf(puzzle, rule) })));
const ofRule = (...ids) => cases.filter((c) => ids.includes(c.rule.rule));
const attrOf = ({ puzzle, rule }) => FAMILY[puzzle.family].attrs.find((a) => a.name === rule.attr);

describe('demos', () => {
  it('cover every rule the generator uses', () => {
    const used = new Set(cases.map((c) => c.rule.rule));
    for (const id of RULE_IDS) expect(used, id).toContain(id);
  });

  it('exist for every rule of every puzzle, with steps and captions', () => {
    for (const { rule, demo } of cases) {
      expect(demo, rule.rule).not.toBeNull();
      expect(['grid', 'strip']).toContain(demo.kind);
      expect(demo.steps.length).toBeGreaterThan(0);
      for (const step of demo.steps) {
        expect(step.caption).toMatch(/\S/);
        expect(step.caption).not.toMatch(/undefined|NaN|\[object/);
        if (demo.kind === 'grid') expect(step.cells).toHaveLength(9);
      }
    }
  });

  it('light up lines whose cells share the value', () => {
    for (const c of ofRule('rows', 'cols', 'latinDown', 'latinUp')) {
      for (const step of c.demo.steps) {
        const values = step.mark.map((i) => JSON.stringify(c.puzzle.cells[i][c.rule.attr]));
        expect(new Set(values).size).toBe(1);
      }
    }
  });

  it('label progression arrows with the step between the two cells', () => {
    for (const c of ofRule('progression', 'progressionWide')) {
      const attr = attrOf(c);
      const wrap = (v) => (attr.kind === 'cyclic' ? mod(v, attr.size) : v);
      for (const step of c.demo.steps) {
        const [a, b] = [step.arrow.from, step.arrow.to].map((i) => c.puzzle.cells[i][attr.name]);
        const step1 = step.arrow.to - step.arrow.from === 1 ? c.rule.params.s : c.rule.params.t;
        expect(wrap(b - a)).toBe(wrap(step1));
      }
    }
  });

  it('merge set operations into exactly the third picture', () => {
    for (const c of ofRule('xor', 'or', 'and', 'minus', 'rminus', 'partition', 'complement')) {
      for (const step of c.demo.steps) {
        const merged = step.items.at(-1);
        const kept = merged.layers.filter((l) => !l.drop).reduce((m, l) => m | l.mask, 0);
        expect(kept).toBe(merged.result);
      }
      // The last step of each set operation ends on the answer.
      if (!['partition', 'complement'].includes(c.rule.rule)) {
        expect(c.demo.steps.at(-1).items.at(-1).result).toBe(c.puzzle.cells[8][c.rule.attr]);
      }
    }
  });

  it('turn pictures onto their neighbor', () => {
    let turned = 0;
    for (const c of ofRule('move')) {
      const family = FAMILY[c.puzzle.family];
      const attr = attrOf(c);
      const keyOf = (mask) => {
        const cell = Object.fromEntries(family.attrs.map((a) => [a.name, a === attr ? mask : 0]));
        return family.render(cell);
      };
      for (const [from, to, name] of [
        [0, 1, c.rule.params.rightName],
        [0, 3, c.rule.params.downName],
      ]) {
        const motion = motionOf(name);
        expect(motion).not.toBeNull();
        if (!motion.rotate) continue;
        const background = new Set(keyOf(0).map((p) => figureKey([p])));
        const parts = (mask) => keyOf(mask).filter((p) => !background.has(figureKey([p])));
        const moved = rotate(parts(c.puzzle.cells[from][attr.name]), motion.rotate);
        expect(figureKey(moved)).toBe(figureKey(parts(c.puzzle.cells[to][attr.name])));
        turned++;
      }
    }
    expect(turned).toBeGreaterThan(0);
  });

  it('read shifts the short way around', () => {
    expect(motionOf('shift01')).toEqual({ rotate: 0, dx: 24, dy: 0 });
    expect(motionOf('shift02')).toEqual({ rotate: 0, dx: -24, dy: 0 });
    expect(motionOf('shift20')).toEqual({ rotate: 0, dx: 0, dy: -24 });
    expect(motionOf('turn270')).toEqual({ rotate: -90, dx: 0, dy: 0 });
  });

  it('draw figures the screen can show', () => {
    for (const { demo } of cases.slice(0, 200)) {
      for (const step of demo.steps) {
        const layers = demo.kind === 'grid' ? step.cells.flat() : step.items.flatMap((item) => item.layers ?? []);
        for (const layer of layers) expect(Array.isArray(layer.figure.paths)).toBe(true);
      }
    }
    expect(figure([]).paths).toEqual([]);
  });
});
