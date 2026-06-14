/**
 * B-06 characterization guard (golden master) — the GameConstants reconnection (#6, 068/154).
 *
 * `calculateDerivedStats` is the balance spine, but the scaling sim only exercises 3 of its
 * ~40 outputs (physAtk / maxHP / physDef). This test captures the FULL output for five
 * representative builds BEFORE the constants refactor, then proves it byte-identical AFTER —
 * so a wrong coefficient transcribed into GameConstants is caught immediately.
 *
 * It also locks the monster-scaling values and proves Monster.ts re-exports the SINGLE
 * GameConstants source of truth (one object instance, no copy).
 *
 * Capture step (against current code): npx vitest run <thisfile> -u -t "byte-identical"
 */
import { describe, it, expect } from 'vitest';
import {
  calculateDerivedStats,
  calculateEffectiveStat,
  getProficiencyThreshold,
  createDefaultStats,
  type Stats,
  type StatName,
  type Grade,
} from '../src/types/Stats';
import * as Mon from '../src/types/Monster';
import * as GC from '../src/constants/GameConstants';

function statsWith(points: Partial<Record<StatName, number>>): Stats {
  const s = createDefaultStats();
  (Object.keys(points) as StatName[]).forEach((k) => {
    s[k] = { grade: 'I', points: points[k] ?? 0, proficiency: 0 };
  });
  return s;
}

describe('B-06 — derived stats are byte-identical after the GameConstants reconnection', () => {
  it('L1 fresh, no weapon (fallback phys branch)', () => {
    expect(calculateDerivedStats(1, createDefaultStats())).toMatchInlineSnapshot(`
      {
        "accuracy": 68.75,
        "arcaneArmor": 1,
        "armorPierce": 0,
        "battleCryBonus": 0,
        "cleaveDamage": 1,
        "comboRamp": 0.15,
        "counterAttackChance": 2.5,
        "critChance": 5.3,
        "critMultiplier": 1.575,
        "debuffDurationReduction": 0.0285,
        "divineShieldValue": 1,
        "dodgeChance": 0.4,
        "dotDamageReduction": 0.05,
        "doubleActionChance": 1.5,
        "endurePainBonus": 2,
        "exploitWeaknessMultiplier": 1.0125,
        "fleeBonus": 1,
        "fortuneStrikeChance": 1.875,
        "fortuneStrikeDamage": 5,
        "healAmplify": 1.025,
        "hpRegenPerTurn": 0,
        "intimidatePower": 60,
        "jinxReduction": 1.25,
        "knockbackChance": 1.25,
        "lastStandDefense": 2,
        "luckAttack": 6,
        "luckyEscapeChance": 1,
        "magicAttack": 5,
        "magicCritMultiplier": 1.56,
        "magicDefense": 5,
        "maxHP": 110,
        "maxSP": 80,
        "moraleBonus": 0,
        "patternAccuracyGain": 5,
        "physicalAttack": 4,
        "physicalDefense": 3,
        "procAmplify": 1.015,
        "skillAmplify": 1.025,
        "spCostReduction": 0.0375,
        "spRegenPerTurn": 0,
        "speed": 6,
        "spellPierce": 1,
        "statusClearChance": 3.35,
        "statusResistance": 0.058499999999999996,
        "trueStrike": 0,
        "unnerveChance": 2.15,
      }
    `);
  });

  it('L1 STR weapon + weaponDamage', () => {
    expect(
      calculateDerivedStats(1, statsWith({ STR: 300 }), {}, 20, 0, 0, 0, 1.0, Infinity, 0, 0, 'STR'),
    ).toMatchInlineSnapshot(`
      {
        "accuracy": 68.75,
        "arcaneArmor": 1,
        "armorPierce": 1,
        "battleCryBonus": 0,
        "cleaveDamage": 2,
        "comboRamp": 0.15,
        "counterAttackChance": 2.5,
        "critChance": 5.3,
        "critMultiplier": 1.575,
        "debuffDurationReduction": 0.0285,
        "divineShieldValue": 1,
        "dodgeChance": 0.4,
        "dotDamageReduction": 0.05,
        "doubleActionChance": 1.5,
        "endurePainBonus": 3,
        "exploitWeaknessMultiplier": 1.0125,
        "fleeBonus": 1,
        "fortuneStrikeChance": 1.875,
        "fortuneStrikeDamage": 5,
        "healAmplify": 1.025,
        "hpRegenPerTurn": 0,
        "intimidatePower": 60,
        "jinxReduction": 1.25,
        "knockbackChance": 2,
        "lastStandDefense": 2,
        "luckAttack": 6,
        "luckyEscapeChance": 1,
        "magicAttack": 5,
        "magicCritMultiplier": 1.56,
        "magicDefense": 5,
        "maxHP": 116,
        "maxSP": 80,
        "moraleBonus": 0,
        "patternAccuracyGain": 5,
        "physicalAttack": 26,
        "physicalDefense": 3,
        "procAmplify": 1.015,
        "skillAmplify": 1.025,
        "spCostReduction": 0.0375,
        "spRegenPerTurn": 0,
        "speed": 6,
        "spellPierce": 1,
        "statusClearChance": 3.35,
        "statusResistance": 0.058499999999999996,
        "trueStrike": 0,
        "unnerveChance": 2.15,
      }
    `);
  });

  it('L5 AGI weapon, carry + blessing 1.2 + weaponLuck/crit', () => {
    expect(
      calculateDerivedStats(
        5,
        statsWith({ AGI: 500, PER: 300, LCK: 400 }),
        { AGI: 2000, PER: 800, LCK: 1500 },
        30, 0, 5, 2, 1.2, Infinity, 4, 5, 'AGI',
      ),
    ).toMatchInlineSnapshot(`
      {
        "accuracy": 110.39999999999999,
        "arcaneArmor": 5,
        "armorPierce": 3,
        "battleCryBonus": 0,
        "cleaveDamage": 6,
        "comboRamp": 1.4999999999999998,
        "counterAttackChance": 18,
        "critChance": 14.975999999999999,
        "critMultiplier": 2.08,
        "debuffDurationReduction": 0.14250000000000002,
        "divineShieldValue": 7,
        "dodgeChance": 4.4639999999999995,
        "dotDamageReduction": 0.25,
        "doubleActionChance": 15,
        "endurePainBonus": 10,
        "exploitWeaknessMultiplier": 1.0625,
        "fleeBonus": 7,
        "fortuneStrikeChance": 15,
        "fortuneStrikeDamage": 44,
        "healAmplify": 1.125,
        "hpRegenPerTurn": 0,
        "intimidatePower": 60,
        "jinxReduction": 10,
        "knockbackChance": 6.25,
        "lastStandDefense": 12,
        "luckAttack": 68,
        "luckyEscapeChance": 8,
        "magicAttack": 30,
        "magicCritMultiplier": 1.8,
        "magicDefense": 32,
        "maxHP": 420,
        "maxSP": 336,
        "moraleBonus": 2,
        "patternAccuracyGain": 30.5,
        "physicalAttack": 78,
        "physicalDefense": 24,
        "procAmplify": 1.1320000000000001,
        "skillAmplify": 1.125,
        "spCostReduction": 0.18749999999999997,
        "spRegenPerTurn": 1,
        "speed": 68,
        "spellPierce": 5,
        "statusClearChance": 16.75,
        "statusResistance": 0.2925,
        "trueStrike": 5,
        "unnerveChance": 10.75,
      }
    `);
  });

  it('L4 WIS caster (magic primary/secondary swap branch)', () => {
    expect(
      calculateDerivedStats(
        4,
        statsWith({ WIS: 600, INT: 400 }),
        { WIS: 1500, INT: 900 },
        0, 25, 0, 4, 1.0, Infinity, 0, 0, 'WIS',
      ),
    ).toMatchInlineSnapshot(`
      {
        "accuracy": 80,
        "arcaneArmor": 6,
        "armorPierce": 3,
        "battleCryBonus": 0,
        "cleaveDamage": 5,
        "comboRamp": 0.6,
        "counterAttackChance": 10,
        "critChance": 6.2,
        "critMultiplier": 1.8,
        "debuffDurationReduction": 0.114,
        "divineShieldValue": 12,
        "dodgeChance": 1.6,
        "dotDamageReduction": 0.2,
        "doubleActionChance": 6,
        "endurePainBonus": 8,
        "exploitWeaknessMultiplier": 1.0825,
        "fleeBonus": 5,
        "fortuneStrikeChance": 7.5,
        "fortuneStrikeDamage": 20,
        "healAmplify": 1.205,
        "hpRegenPerTurn": 0,
        "intimidatePower": 60,
        "jinxReduction": 5,
        "knockbackChance": 5,
        "lastStandDefense": 10,
        "luckAttack": 24,
        "luckyEscapeChance": 4,
        "magicAttack": 64,
        "magicCritMultiplier": 1.96,
        "magicDefense": 43,
        "maxHP": 290,
        "maxSP": 408,
        "moraleBonus": 2,
        "patternAccuracyGain": 26.5,
        "physicalAttack": 16,
        "physicalDefense": 12,
        "procAmplify": 1.06,
        "skillAmplify": 1.165,
        "spCostReduction": 0.24749999999999997,
        "spRegenPerTurn": 1,
        "speed": 24,
        "spellPierce": 6,
        "statusClearChance": 20,
        "statusResistance": 0.23399999999999999,
        "trueStrike": 3,
        "unnerveChance": 8.6,
      }
    `);
  });

  it('L3 END tank, weaponMaxOutputCap clamp + blessing 0.8', () => {
    expect(
      calculateDerivedStats(
        3,
        statsWith({ END: 700, LCK: 800, CHA: 300 }),
        { END: 1200 },
        10, 0, 8, 3, 0.8, 50, 0, 0, 'END',
      ),
    ).toMatchInlineSnapshot(`
      {
        "accuracy": 61,
        "arcaneArmor": 3,
        "armorPierce": 2,
        "battleCryBonus": 0,
        "cleaveDamage": 3,
        "comboRamp": 0.44999999999999996,
        "counterAttackChance": 7.5,
        "critChance": 4.976,
        "critMultiplier": 1.765,
        "debuffDurationReduction": 0.10260000000000001,
        "divineShieldValue": 4,
        "dodgeChance": 0.96,
        "dotDamageReduction": 0.3,
        "doubleActionChance": 4.5,
        "endurePainBonus": 6,
        "exploitWeaknessMultiplier": 1.0375,
        "fleeBonus": 5,
        "fortuneStrikeChance": 8.625,
        "fortuneStrikeDamage": 23,
        "healAmplify": 1.075,
        "hpRegenPerTurn": 1,
        "intimidatePower": 60,
        "jinxReduction": 5.75,
        "knockbackChance": 3.75,
        "lastStandDefense": 17,
        "luckAttack": 22,
        "luckyEscapeChance": 4.6000000000000005,
        "magicAttack": 12,
        "magicCritMultiplier": 1.6800000000000002,
        "magicDefense": 14,
        "maxHP": 336,
        "maxSP": 144,
        "moraleBonus": 1,
        "patternAccuracyGain": 15,
        "physicalAttack": 24,
        "physicalDefense": 22,
        "procAmplify": 1.069,
        "skillAmplify": 1.075,
        "spCostReduction": 0.11249999999999999,
        "spRegenPerTurn": 0,
        "speed": 14,
        "spellPierce": 3,
        "statusClearChance": 10.05,
        "statusResistance": 0.35,
        "trueStrike": 2,
        "unnerveChance": 7.74,
      }
    `);
  });
});

describe('B-06 — Falna + proficiency formulas unchanged and now constant-driven', () => {
  it('effective stat = level*500 + points + carry', () => {
    expect(calculateEffectiveStat(5, 300, 2000)).toBe(5 * 500 + 300 + 2000);
  });

  it('proficiency threshold = 100*(index+1) across all grades', () => {
    const grades: Grade[] = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
    expect(grades.map(getProficiencyThreshold)).toEqual(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    );
  });
});

describe('B-06 — monster scaling has ONE source of truth (GameConstants) with locked values', () => {
  it('Monster.ts re-exports the SAME object instances as GameConstants', () => {
    expect(Mon.MONSTER_LEVEL_MULTIPLIERS).toBe(GC.MONSTER_LEVEL_MULTIPLIERS);
    expect(Mon.MONSTER_STAT_SCALING).toBe(GC.MONSTER_STAT_SCALING);
    expect(Mon.PLAYER_LEVEL_FLOOR_ZONES).toBe(GC.PLAYER_LEVEL_FLOOR_ZONES);
  });

  it('scaling values match the audited baseline', () => {
    expect(GC.MONSTER_LEVEL_MULTIPLIERS).toEqual({ earlyGame: 8, midGame: 16, lateGame: 26, mythic: 36 });
    expect(GC.MONSTER_STAT_SCALING).toEqual({ hp: 1.0, attack: 0.2, defense: 0.1, magicDefense: 0.08, speed: 0.12 });
    expect(GC.PLAYER_LEVEL_FLOOR_ZONES).toHaveLength(7);
    expect(GC.PLAYER_LEVEL_FLOOR_ZONES[6]).toEqual({
      minFloor: 86, maxFloor: 999, targetPlayerLevel: 7, zoneMultiplier: 9.0,
    });
  });
});
