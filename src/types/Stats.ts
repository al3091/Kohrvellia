/**
 * Core stat system types for Kohrvellia
 * Based on D&D + Fallout SPECIAL merged system with DanMachi-style grades
 */

// The 8 core stats
export type StatName = 'STR' | 'PER' | 'END' | 'CHA' | 'INT' | 'AGI' | 'WIS' | 'LCK';

// Grade letters (I is lowest, SSS is highest)
export type Grade = 'I' | 'H' | 'G' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

// Grade point ranges
export const GRADE_RANGES: Record<Grade, { min: number; max: number }> = {
  I: { min: 0, max: 99 },
  H: { min: 100, max: 199 },
  G: { min: 200, max: 299 },
  F: { min: 300, max: 399 },
  E: { min: 400, max: 499 },
  D: { min: 500, max: 599 },
  C: { min: 600, max: 699 },
  B: { min: 700, max: 799 },
  A: { min: 800, max: 899 },
  S: { min: 900, max: 949 },
  SS: { min: 950, max: 979 },
  SSS: { min: 980, max: 999 },
};

// Grade order for comparisons
export const GRADE_ORDER: Grade[] = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

// Stat value with grade and points
export interface StatValue {
  grade: Grade;
  points: number; // 0-999 within level
  proficiency: number; // Progress toward next grade (resets on grade-up)
}

// All 8 stats mapped
export type Stats = Record<StatName, StatValue>;

// Stat metadata for display
export interface StatInfo {
  name: StatName;
  fullName: string;
  description: string;
  combatEffect: string;
  nonCombatEffect: string;
  growthMethod: string;
}

export const STAT_INFO: Record<StatName, StatInfo> = {
  STR: {
    name: 'STR',
    fullName: 'Strength',
    description: 'Melee damage, carry capacity, physical feats',
    combatEffect: '+Physical melee damage, +Block power',
    nonCombatEffect: '+Carry capacity, +Force checks',
    growthMethod: 'Deal melee damage, break objects, carry heavy loads',
  },
  PER: {
    name: 'PER',
    fullName: 'Perception',
    description: 'Trap detection, ranged accuracy, awareness',
    combatEffect: '+Ranged accuracy, +Crit chance',
    nonCombatEffect: '+Trap detection, +Search success',
    growthMethod: 'Detect traps, search rooms, land ranged attacks',
  },
  END: {
    name: 'END',
    fullName: 'Endurance',
    description: 'Health pool, stamina, poison/bleed resistance',
    combatEffect: '+Max HP, +Status resistance',
    nonCombatEffect: '+Stamina duration, +Poison survival',
    growthMethod: 'Take damage, resist status effects, survive tough fights',
  },
  CHA: {
    name: 'CHA',
    fullName: 'Charisma',
    description: 'NPC interactions, prices, social skills',
    combatEffect: '+Party buff power, +Intimidate',
    nonCombatEffect: '+Shop prices, +NPC reputation gain',
    growthMethod: 'Negotiate with NPCs, intimidate foes, inspire allies',
  },
  INT: {
    name: 'INT',
    fullName: 'Intelligence',
    description: 'Magic power, skill learning speed, puzzles',
    combatEffect: '+Magic damage, +Spell slots',
    nonCombatEffect: '+Skill learn speed, +Puzzle hints',
    growthMethod: 'Cast spells, solve puzzles, learn new skills',
  },
  AGI: {
    name: 'AGI',
    fullName: 'Agility',
    description: 'Dodge chance, speed, initiative, stealth',
    combatEffect: '+Dodge chance, +Initiative',
    nonCombatEffect: '+Flee success, +Stealth',
    growthMethod: 'Dodge attacks, act first in combat, sneak past enemies',
  },
  WIS: {
    name: 'WIS',
    fullName: 'Wisdom',
    description: 'Magic defense, intuition, divine favor',
    combatEffect: '+Magic defense, +Healing power',
    nonCombatEffect: '+Shrine blessings, +Divine favor',
    growthMethod: 'Resist magic, use healing, pray at shrines',
  },
  LCK: {
    name: 'LCK',
    fullName: 'Luck',
    description: 'Critical hits, loot quality, random events',
    combatEffect: '+Crit damage, +Status proc',
    nonCombatEffect: '+Loot quality, +Random events',
    growthMethod: 'Land critical hits, find rare loot, take risks',
  },
};

// ===== UTILITY FUNCTIONS =====

/**
 * Falna Formula: EffectiveStat = (Level × 500) + CurrentGradePoints + CarryFromPreviousLevels
 *
 * The carry parameter is the sum of final stat points from all previous level-up snapshots
 * stored in Character.levelHistory. This ensures:
 *   - Level N at Grade I is always stronger than Level N-1 at Grade SSS (power floor guarantee)
 *   - Grinding a stat fully at Level 1 pays dividends at Level 2 and beyond
 *   - Nothing is lost on level-up — all progress carries forward permanently
 */
export function calculateEffectiveStat(level: number, points: number, carry: number = 0): number {
  return level * 500 + points + carry;
}

/**
 * Convert grade letter to numeric index (0-11)
 */
export function gradeToIndex(grade: Grade): number {
  return GRADE_ORDER.indexOf(grade);
}

/**
 * Convert numeric index to grade letter
 */
export function indexToGrade(index: number): Grade {
  if (index < 0) return 'I';
  if (index >= GRADE_ORDER.length) return 'SSS';
  return GRADE_ORDER[index];
}

/**
 * Get grade from point value
 */
export function getGradeFromPoints(points: number): Grade {
  const clampedPoints = Math.max(0, Math.min(999, points));
  for (const grade of [...GRADE_ORDER].reverse()) {
    if (clampedPoints >= GRADE_RANGES[grade].min) {
      return grade;
    }
  }
  return 'I';
}

/**
 * Compare two grades (returns -1, 0, or 1)
 */
export function compareGrades(a: Grade, b: Grade): number {
  return gradeToIndex(a) - gradeToIndex(b);
}

/**
 * Check if stat meets minimum grade requirement
 */
export function meetsGradeRequirement(stat: StatValue, requiredGrade: Grade): boolean {
  return compareGrades(stat.grade, requiredGrade) >= 0;
}

/**
 * Calculate proficiency threshold for next grade
 * Higher grades require more proficiency to advance
 */
export function getProficiencyThreshold(currentGrade: Grade): number {
  const index = gradeToIndex(currentGrade);
  return 100 * (index + 1);
}

/**
 * Create default stats at grade I with 0 points
 */
export function createDefaultStats(): Stats {
  const defaultStat: StatValue = { grade: 'I', points: 0, proficiency: 0 };
  return {
    STR: { ...defaultStat },
    PER: { ...defaultStat },
    END: { ...defaultStat },
    CHA: { ...defaultStat },
    INT: { ...defaultStat },
    AGI: { ...defaultStat },
    WIS: { ...defaultStat },
    LCK: { ...defaultStat },
  };
}

/**
 * Format stat for display: "STR: B-782"
 */
export function formatStat(name: StatName, value: StatValue): string {
  return `${name}: ${value.grade}-${value.points}`;
}

/**
 * Apply exponential soft cap to a raw stat contribution.
 * Prevents linear late-game scaling while preserving early-game feel.
 * Formula: softCap × (1 - e^(-raw/softCap))
 *   - At raw=softCap: output ≈ 0.632 × softCap
 *   - As raw → ∞: output asymptotically approaches softCap
 * Example with softCap=400: raw=400 → 253, raw=1000 → 330, raw=5999 → ~400
 */
export function applySoftCap(rawStat: number, softCap: number): number {
  return softCap * (1 - Math.exp(-rawStat / softCap));
}

/**
 * Calculate all derived stats from base stats
 */
export interface DerivedStats {
  // ── Pools (uncapped, intentional scaling reward) ──
  maxHP: number;
  maxSP: number;

  // ── Core offensive / defensive (soft-capped) ──
  physicalAttack: number;
  magicAttack: number;
  luckAttack: number;
  physicalDefense: number;
  magicDefense: number;
  speed: number;
  critChance: number;
  dodgeChance: number;

  // ── Accuracy & crit quality ──
  accuracy: number;             // Base hit chance % (replaces inline 70+PER*0.3)
  critMultiplier: number;       // Physical crit damage multiplier (PER + LCK)
  magicCritMultiplier: number;  // Magic crit multiplier (WIS + INT)

  // ── STR secondary interactions ──
  armorPierce: number;          // Flat amount subtracted from enemy defense
  knockbackChance: number;      // % chance to stun enemy on hit
  cleaveDamage: number;         // Flat bonus damage when player HP ≥ 50%
  endurePainBonus: number;      // Flat defense bonus when player HP < 25%

  // ── PER secondary interactions ──
  counterAttackChance: number;  // % chance to auto-counter on successful dodge
  trueStrike: number;           // Reduces enemy evasion/accuracy by this amount
  patternAccuracyGain: number;  // Accuracy gained per round (PER+INT synergy, accumulates each turn)

  // ── END secondary interactions ──
  statusResistance: number;     // 0.0–0.35: reduces status proc chance and duration
  hpRegenPerTurn: number;       // HP restored at the start of each player turn
  dotDamageReduction: number;   // 0.0–0.30: reduces all DoT (poison/burn/bleed) damage
  lastStandDefense: number;     // Flat defense bonus when player HP < 25%

  // ── CHA secondary interactions ──
  intimidatePower: number;      // Taunt success base chance (replaces 40+CHA*0.5)
  battleCryBonus: number;       // Flat damage bonus active on turns 1–3
  unnerveChance: number;        // % chance to apply Weaken to enemy on each hit
  fleeBonus: number;            // Flat % added to flee chance
  debuffDurationReduction: number; // 0.0–0.20: reduces duration of debuffs on player
  moraleBonus: number;          // Flat damage bonus for 2 turns after landing Stun/Taunt

  // ── INT secondary interactions ──
  skillAmplify: number;         // Multiplier on all skill damage/heal values (1.0+)
  spCostReduction: number;      // 0.0–0.30: reduces all skill SP costs
  exploitWeaknessMultiplier: number; // Per-debuff damage multiplier (base; applied N times)
  arcaneArmor: number;          // Bonus magic defense from INT intellect

  // ── AGI secondary interactions ──
  doubleActionChance: number;   // % chance for a free second hit at 70% power
  comboRamp: number;            // Flat damage added per consecutive hit (up to 5 stacks)

  // ── WIS secondary interactions ──
  spRegenPerTurn: number;       // SP restored at the start of each player turn
  healAmplify: number;          // Multiplier on all healing received (1.0+)
  divineShieldValue: number;    // Magic damage absorbed once every 5 turns
  statusClearChance: number;    // % chance per turn to auto-remove one debuff

  // ── LCK secondary interactions ──
  fortuneStrikeChance: number;  // % chance per hit to deal bonus fortune damage
  fortuneStrikeDamage: number;  // Bonus damage on fortune proc
  jinxReduction: number;        // Reduces enemy crit chance by this %
  luckyEscapeChance: number;    // % chance to survive a lethal hit at 1 HP
  procAmplify: number;          // Multiplier on all status effect proc chances (1.0+)
}

/**
 * Calculate derived combat stats from base stats, equipment, deity blessing, and level carry.
 *
 * Soft caps have been removed. Coefficients are recalibrated for the linear effX scale:
 *   Level 1 Grade I  → effX ≈  500  → physAtk ≈  4 (needs weapon to be effective)
 *   Level 1 Grade A  → effX ≈ 1300  → physAtk ≈ 10
 *   Level 2 +carry   → effX ≈ 1800  → physAtk ≈ 14
 *   Level 5 +carry   → effX ≈ 5000  → physAtk ≈ 40
 *
 * @param carryStats  Sum of final stat points from all previous levels (Character.levelHistory).
 *                    Pass {} or omit for new characters and legacy saves.
 * @param blessingMultiplier  Multiplier from deity favor (0.5 to 1.5)
 */
export function calculateDerivedStats(
  level: number,
  stats: Stats,
  carryStats: Partial<Record<StatName, number>> = {},
  weaponDamage: number = 0,
  weaponMagic: number = 0,
  armorDefense: number = 0,
  armorMagicDef: number = 0,
  blessingMultiplier: number = 1.0,
  weaponMaxOutputCap: number = Infinity,
  weaponLuck: number = 0
): DerivedStats {
  // Effective stats include current-level points + permanent carry from all previous levels
  const effSTR = calculateEffectiveStat(level, stats.STR.points, carryStats.STR ?? 0);
  const effPER = calculateEffectiveStat(level, stats.PER.points, carryStats.PER ?? 0);
  const effEND = calculateEffectiveStat(level, stats.END.points, carryStats.END ?? 0);
  const effCHA = calculateEffectiveStat(level, stats.CHA.points, carryStats.CHA ?? 0);
  const effINT = calculateEffectiveStat(level, stats.INT.points, carryStats.INT ?? 0);
  const effAGI = calculateEffectiveStat(level, stats.AGI.points, carryStats.AGI ?? 0);
  const effWIS = calculateEffectiveStat(level, stats.WIS.points, carryStats.WIS ?? 0);
  const effLCK = calculateEffectiveStat(level, stats.LCK.points, carryStats.LCK ?? 0);

  // ── Pools (uncapped — intentional progression reward) ──
  const baseHP = 50 + effEND * 0.1 + effSTR * 0.02;
  const baseSP = 30 + effWIS * 0.06 + effINT * 0.04;

  // ── INT arcane armor (contributes to magicDefense) ──
  const arcaneArmor = Math.min(30, effINT * 0.002);

  // ── Core combat stats (linear scale, no soft cap) ──
  // C2: Weapon quality caps total physical attack — crude weapons cannot scale with high stats
  const basePhysicalAttack = Math.min(effSTR * 0.008 + weaponDamage, weaponMaxOutputCap);
  const baseMagicAttack = effINT * 0.008 + effWIS * 0.002 + weaponMagic;
  const baseLuckAttack = effLCK * 0.008 + weaponLuck;
  const basePhysicalDefense = effEND * 0.006 + armorDefense;
  const baseMagicDefense = effWIS * 0.008 + armorMagicDef + arcaneArmor;
  const baseSpeed = effAGI * 0.010 + effPER * 0.002;
  const baseCritChance = 5 + effLCK * 0.0004 + effPER * 0.0002;
  const baseDodgeChance = effAGI * 0.0006 + effPER * 0.0002;

  // ── Accuracy & crit quality ──
  const baseAccuracy = 65 + effPER * 0.0075;                                   // 65–95% range
  const baseCritMultiplier = 1.5 + effPER * 0.0001 + effLCK * 0.00005;        // 1.5–2.0×
  const baseMagicCritMultiplier = 1.5 + effWIS * 0.00008 + effINT * 0.00004;  // 1.5–1.9×

  // ── STR secondary interactions ──
  const baseArmorPierce = Math.min(20, effSTR * 0.0015);
  const baseKnockbackChance = Math.min(15, effSTR * 0.0025);
  const baseCleaveDamage = Math.min(25, effSTR * 0.0025);
  const baseEndurePain = Math.min(30, effSTR * 0.004);

  // ── PER secondary interactions ──
  const baseCounterChance = Math.min(20, effPER * 0.005);
  const baseTrueStrike = Math.min(15, effPER * 0.0015);
  const basePatternAccGain = effPER * 0.005 + effINT * 0.005;   // per-turn accuracy gain

  // ── END secondary interactions ──
  const baseStatusResistance = Math.min(0.35, effEND * 0.000117);
  const baseHpRegen = Math.floor(effEND * 0.0003);
  const baseDotReduction = Math.min(0.30, effEND * 0.0001);
  const baseLastStand = Math.min(40, effEND * 0.005);

  // ── CHA secondary interactions ──
  const baseIntimidatePower = 40 + Math.min(20, effCHA * 0.057);
  const baseBattleCry = 0; // Retired — replaced by Kairos sequenceBonus
  const baseUnnerve = Math.min(15, effCHA * 0.0043);
  const baseFleeBonus = Math.min(20, Math.floor(effCHA * 0.0029));
  const baseDebuffDuration = Math.min(0.20, effCHA * 0.000057);
  const baseMorale = Math.min(15, effCHA * 0.001);

  // ── INT secondary interactions ──
  const baseSkillAmplify = 1.0 + Math.min(0.5, effINT * 0.00005);
  const baseSpCostReduce = Math.min(0.30, effINT * 0.000075);
  const baseExploitMult = 1.0 + Math.min(0.15, effINT * 0.000025);

  // ── AGI secondary interactions ──
  const baseDoubleAction = Math.min(25, effAGI * 0.003);
  const baseComboRamp = Math.min(5, effAGI * 0.0003);

  // ── WIS secondary interactions ──
  const baseSpRegen = Math.floor(effWIS * 0.0004);
  const baseHealAmplify = 1.0 + Math.min(0.30, effWIS * 0.00005);
  const baseDivineShield = Math.min(50, effWIS * 0.003);
  const baseStatusClear = Math.min(20, effWIS * 0.0067);

  // ── LCK secondary interactions ──
  const baseFortuneChance = Math.min(15, effLCK * 0.00375);
  const baseFortuneDamage = Math.min(60, effLCK * 0.01);
  const baseJinx = Math.min(10, effLCK * 0.0025);
  const baseLuckyEscape = Math.min(8, effLCK * 0.002);
  const baseProcAmplify = 1.0 + Math.min(0.20, effLCK * 0.00003);

  // ── Apply blessing multiplier to core combat output stats only ──
  // Passive percentages, regen rates, and utility multipliers are not affected by deity favor.
  return {
    maxHP: Math.floor(baseHP * blessingMultiplier),
    maxSP: Math.floor(baseSP * blessingMultiplier),
    physicalAttack: Math.floor(basePhysicalAttack * blessingMultiplier),
    magicAttack: Math.floor(baseMagicAttack * blessingMultiplier),
    luckAttack: Math.floor(baseLuckAttack * blessingMultiplier),
    physicalDefense: Math.floor(basePhysicalDefense * blessingMultiplier),
    magicDefense: Math.floor(baseMagicDefense * blessingMultiplier),
    speed: Math.floor(baseSpeed * blessingMultiplier),
    critChance: baseCritChance * blessingMultiplier,
    dodgeChance: baseDodgeChance * blessingMultiplier,

    accuracy: baseAccuracy * blessingMultiplier,
    critMultiplier: baseCritMultiplier,
    magicCritMultiplier: baseMagicCritMultiplier,

    armorPierce: Math.floor(baseArmorPierce),
    knockbackChance: baseKnockbackChance,
    cleaveDamage: Math.floor(baseCleaveDamage),
    endurePainBonus: Math.floor(baseEndurePain),

    counterAttackChance: baseCounterChance,
    trueStrike: Math.floor(baseTrueStrike),
    patternAccuracyGain: basePatternAccGain,

    statusResistance: baseStatusResistance,
    hpRegenPerTurn: baseHpRegen,
    dotDamageReduction: baseDotReduction,
    lastStandDefense: Math.floor(baseLastStand),

    intimidatePower: baseIntimidatePower,
    battleCryBonus: Math.floor(baseBattleCry),
    unnerveChance: baseUnnerve,
    fleeBonus: baseFleeBonus,
    debuffDurationReduction: baseDebuffDuration,
    moraleBonus: Math.floor(baseMorale),

    skillAmplify: baseSkillAmplify,
    spCostReduction: baseSpCostReduce,
    exploitWeaknessMultiplier: baseExploitMult,
    arcaneArmor: Math.floor(arcaneArmor),

    doubleActionChance: baseDoubleAction,
    comboRamp: baseComboRamp,

    spRegenPerTurn: baseSpRegen,
    healAmplify: baseHealAmplify,
    divineShieldValue: Math.floor(baseDivineShield),
    statusClearChance: baseStatusClear,

    fortuneStrikeChance: baseFortuneChance,
    fortuneStrikeDamage: Math.floor(baseFortuneDamage),
    jinxReduction: baseJinx,
    luckyEscapeChance: baseLuckyEscape,
    procAmplify: baseProcAmplify,
  };
}
