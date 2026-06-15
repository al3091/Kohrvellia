/**
 * B-09 guard (step 1) — characterization of the CURRENT status-effect behavior, written BEFORE the
 * "one model" unification so the refactor can't silently change how effects tick, stack, or deal
 * damage. These lock the canonical helpers in `src/types/StatusEffect.ts` (the model combat uses).
 *
 * Acceptance criteria the unification must ALSO satisfy (added as real assertions once the bridge
 * + statModifier wiring land in later steps):
 *   - a buff potion's stat change actually applies in combat (today it's filed in
 *     `character.statusEffects`, which combat never reads — KV-AUD-374/377);
 *   - a Weaken-style debuff measurably lowers effective attack;
 *   - an old-shape save's statusEffects hydrate into the unified shape.
 */
import { describe, it, expect } from 'vitest';
import {
  createStatusEffect,
  applyStatusEffect,
  tickStatusEffects,
  calculateStatusDamage,
  getAccuracyModifier,
  getHealingModifier,
  hasStatusEffect,
  removeStatusEffect,
  removeStatusEffectByType,
  STATUS_EFFECT_DEFINITIONS,
} from '../src/types/StatusEffect';

describe('B-09 guard — createStatusEffect copies the definition + adds instance fields', () => {
  it('builds a poison instance from its definition', () => {
    const e = createStatusEffect('poison');
    expect(e.type).toBe('poison');
    expect(e.percentDamage).toBe(STATUS_EFFECT_DEFINITIONS.poison.percentDamage); // 5
    expect(e.duration).toBe(STATUS_EFFECT_DEFINITIONS.poison.duration); // 3
    expect(typeof e.id).toBe('string');
    expect(typeof e.appliedAt).toBe('number');
  });
});

describe('B-09 guard — calculateStatusDamage', () => {
  it('flat damagePerTurn × stacks, plus percent of maxHP', () => {
    expect(calculateStatusDamage(createStatusEffect('burn'), 200)).toBe(5); // flat 5, no percent
    expect(calculateStatusDamage(createStatusEffect('poison'), 200)).toBe(10); // 5% of 200
    expect(calculateStatusDamage({ ...createStatusEffect('bleed'), stacks: 3 }, 200)).toBe(9); // 3×3
  });
});

describe('B-09 guard — applyStatusEffect stacking vs refresh', () => {
  it('stacks a stackable effect (bleed) up to its cap', () => {
    let effects = applyStatusEffect([], createStatusEffect('bleed'));
    expect(effects).toHaveLength(1);
    expect(effects[0].stacks).toBe(1);
    effects = applyStatusEffect(effects, createStatusEffect('bleed'));
    expect(effects).toHaveLength(1); // same type → not appended
    expect(effects[0].stacks).toBe(2);
  });

  it('refreshes (not stacks) a non-stackable effect to the longer duration', () => {
    let p = applyStatusEffect([], createStatusEffect('poison'));
    p = applyStatusEffect(p, { ...createStatusEffect('poison'), duration: 99 });
    expect(p).toHaveLength(1);
    expect(p[0].duration).toBe(99);
  });
});

describe('B-09 guard — tickStatusEffects', () => {
  it('decrements duration, removes expired, keeps permanent (-1)', () => {
    const ticked = tickStatusEffects([
      { ...createStatusEffect('stun'), duration: 1 },
      { ...createStatusEffect('curse'), duration: -1 },
    ]);
    expect(ticked.find((e) => e.type === 'stun')).toBeUndefined(); // 1 → 0 → removed
    expect(ticked.find((e) => e.type === 'curse')?.duration).toBe(-1); // permanent kept
  });
});

describe('B-09 guard — accuracy + healing modifiers', () => {
  it('sums accuracy modifiers and honors prevents/reduces healing', () => {
    expect(getAccuracyModifier([createStatusEffect('blind')])).toBe(-50);
    expect(getHealingModifier([createStatusEffect('curse')])).toBe(0); // preventsHealing
    expect(getHealingModifier([createStatusEffect('burn')])).toBe(0.5); // reducesHealing 50%
  });
});

describe('B-09 guard — has / remove', () => {
  it('finds by type and removes by id or type', () => {
    const effects = [createStatusEffect('poison'), createStatusEffect('weaken')];
    expect(hasStatusEffect(effects, 'weaken')).toBe(true);
    expect(hasStatusEffect(effects, 'stun')).toBe(false);
    expect(removeStatusEffect(effects, effects[0].id)).toHaveLength(1);
    expect(removeStatusEffectByType(effects, 'weaken')).toHaveLength(1);
  });
});
