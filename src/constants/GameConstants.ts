/**
 * Game balance constants for Kohrvellia
 * All tunable game values in one place
 */

// Character limits
export const CharacterLimits = {
  maxLevel: 10,
  maxGradePoints: 999,
  maxStatGrade: 'SSS',
  minGradeForLevelUp: 'D', // All stats must be at least D
  minGradePointsForLevelUp: 500,
  baseHP: 50,
  baseSP: 30,
  baseCarryCapacity: 10,
} as const;

// Falna formula constants
export const FalnaFormula = {
  levelMultiplier: 500, // EffectiveStat = Level * 500 + Points
} as const;

// Derived stat formulas — the SINGLE source of truth for calculateDerivedStats (Stats.ts).
// B-06 reconnection: these coefficients are the LIVE values the combat math actually uses
// (recalibrated for the linear effX scale). Previously this block had drifted ~10× from the
// code and was never imported — editing it changed nothing. It is now wired; edit HERE to tune.
export const DerivedStatFormulas = {
  hp: { base: 50, endMultiplier: 0.1, strMultiplier: 0.02 },
  sp: { base: 30, wisMultiplier: 0.06, intMultiplier: 0.04 },
  // Physical attack scales by the equipped weapon's category; hybrids/no-weapon use the fallback.
  physicalAttack: {
    coefficients: { STR: 0.008, AGI: 0.007, PER: 0.005, END: 0.006, CHA: 0.005 },
    fallbackStrMultiplier: 0.008,
  },
  // Magic attack: WIS-category weapons swap the INT/WIS primary & secondary coefficients.
  magicAttack: {
    intPrimary: 0.008, wisSecondary: 0.002, // default (INT caster)
    wisPrimary: 0.008, intSecondary: 0.002, // WIS-weapon swap
  },
  luckAttack: { lckMultiplier: 0.012 },
  physicalDefense: { endMultiplier: 0.006 },
  magicDefense: { wisMultiplier: 0.008 },
  speed: { agiMultiplier: 0.01, perMultiplier: 0.002 },
  critChance: { base: 5, lckMultiplier: 0.0004, perMultiplier: 0.0002 },
  dodgeChance: { agiMultiplier: 0.0006, perMultiplier: 0.0002 },
  accuracy: { base: 65, perMultiplier: 0.0075 },
  critMultiplier: { base: 1.5, perMultiplier: 0.0001, lckMultiplier: 0.00005 },
  magicCritMultiplier: { base: 1.5, wisMultiplier: 0.00008, intMultiplier: 0.00004 },
  arcaneArmor: { intMultiplier: 0.002, cap: 30 },
  spellPierce: { intMultiplier: 0.002 },
} as const;

// Proficiency thresholds for stat growth
export const ProficiencyThresholds = {
  basePerGrade: 100, // I→H: 100, H→G: 200, etc.
  multiplierPerGrade: 1, // Linear: gradeIndex + 1
} as const;

// Combat constants
export const Combat = {
  damageEffectiveness: {
    strong: 1.5,
    neutral: 1.0,
    weak: 0.75,
  },
  counter: {
    spCost: 10,
    cooldownTurns: 2,
  },
  flee: {
    baseChance: 50, // Base % chance
    agiBonus: 0.5, // % per AGI point
    penaltyPerFloor: 2, // % harder per floor deeper
  },
  defend: {
    defenseMultiplier: 1.5,
  },
  critDamage: {
    multiplier: 2.0,
  },
} as const;

// Dungeon constants
export const Dungeon = {
  bossFloorInterval: 5, // Boss every 5 floors
  restSite: {
    baseChance: 0.15, // 15% at floor 1
    decayRate: 0.85, // Exponential decay
  },
  encounterChance: {
    baseFloors1to5: 0.4,
    baseFloors6to10: 0.5,
    incrementPer10Floors: 0.05,
    max: 0.75,
  },
} as const;

// Rest site healing
export const RestSiteHealing = {
  graceOasis: { hpPercent: 1.0, spPercent: 1.0 }, // Full restore
  restorativeSpring: { hpPercent: 0.5, curesPoison: true, curesBleed: true },
  campsite: { hpPercent: 0, spPercent: 1.0 }, // SP only
} as const;

// Reputation system
export const Reputation = {
  min: -20,
  max: 20,
  startingValue: 1,
  baseXPToNextLevel: 100,
  xpMultiplierPerLevel: 1.5,
  negativeFasterMultiplier: 1.5, // Negative actions have more impact
} as const;

// Reputation effects
export const ReputationEffects = {
  chatLimits: {
    hostile: 0, // -20 to -10
    unfriendly: 1, // -9 to 0
    friendly: 2, // +1 to +5
    liked: 3, // +6 to +10
    trusted: 5, // +11 to +15
    beloved: -1, // +16 to +20 (unlimited)
  },
  priceModifiers: {
    hostile: 2.0, // 200%
    unfriendly: 1.5, // 150%
    neutral: 1.0, // 100%
    friendly: 1.0, // 100%
    liked: 0.9, // 90%
    trusted: 0.75, // 75%
    beloved: 0.6, // 60%
  },
} as const;

// Deity system
export const Deity = {
  startingFavor: 50,
  minFavor: 0,
  maxFavor: 100,
  statBonusValue: 10,
  statPenaltyValue: 5,
  domainBlessingPercent: 10,
} as const;

// Achievement stacking
export const AchievementStacking = {
  maxStack: 3,
  multipliers: {
    1: 1.0,
    2: 1.25,
    3: 1.5,
  },
  sameTierBonus: {
    double: 1,
    triple: 2,
  },
} as const;

// Loot system
export const Loot = {
  baseGoldPerCR: 10,
  goldVariance: 0.2, // ±20%
  luckBonusPerPoint: 0.01, // 1% per LCK point
} as const;

// Shop prices (base costs in gold)
export const ShopPrices = {
  healthPotion: 25,
  antidote: 50,
  bandage: 30,
  skillTrainingBase: 500,
  equipmentRepairPercent: 0.1, // 10% of item value
  identification: 100,
  blessing: 250,
  curseRemoval: 500,
} as const;

// Weapon balance
export const WeaponBalance = {
  qualityModifiers: {
    crude: { accuracy: -0.1, crit: 0, damage: -0.1 },
    standard: { accuracy: 0, crit: 0, damage: 0 },
    fine: { accuracy: 0, crit: 0.05, damage: 0 },
    superior: { accuracy: 0, crit: 0.1, damage: 0.05 },
    masterwork: { accuracy: 0.05, crit: 0.15, damage: 0.1 },
    legendary: { accuracy: 0.1, crit: 0.25, damage: 0.2 },
  },
  materialModifiers: {
    junk: -0.2,
    common: 0,
    uncommon: 0.1,
    rare: 0.25,
    epic: 0.5,
    legendary: 1.0,
  },
} as const;

// Armor balance
export const ArmorBalance = {
  typeModifiers: {
    light: { defense: 0.6, magicDef: 0.6, speedPenalty: 0, dodgePenalty: 0 },
    medium: { defense: 1.0, magicDef: 1.0, speedPenalty: -0.1, dodgePenalty: -0.05 },
    heavy: { defense: 1.5, magicDef: 0.5, speedPenalty: -0.25, dodgePenalty: -0.15 },
    robes: { defense: 0.3, magicDef: 1.5, speedPenalty: 0, dodgePenalty: 0 },
  },
} as const;

// Monster balance
export const MonsterBalance = {
  crScaling: {
    hpPerCR: 20,
    attackPerCR: 5,
    defensePerCR: 3,
  },
  prefixModifiers: {
    negative: 0.7,
    low: 1.1,
    mid: 1.25,
    high: 1.5,
    legendary: 2.0,
  },
} as const;

// Soul system (Denatus)
export const SoulSystem = {
  crScoreRanges: {
    novice: { min: 0, max: 20 },
    apprentice: { min: 21, max: 35 },
    journeyman: { min: 36, max: 50 },
    adept: { min: 51, max: 65 },
    expert: { min: 66, max: 75 },
    master: { min: 76, max: 85 },
    grandmaster: { min: 86, max: 92 },
    heroic: { min: 93, max: 97 },
    legendary: { min: 98, max: 99 },
    mythic: { min: 100, max: 100 },
  },
  magnitudeMultipliers: {
    novice: 1.0,
    apprentice: 1.2,
    journeyman: 1.4,
    adept: 1.6,
    expert: 1.8,
    master: 2.0,
    grandmaster: 2.3,
    heroic: 2.6,
    legendary: 2.8,
    mythic: 3.0,
  },
  statBonusBase: 0.15, // 15% base bonus to top 2 stats
} as const;

// ===== DUNGEON RUN FLAGS =====
// All valid string flags used with setRunFlag() / getRunFlags() / clearRunFlag()
// in useDungeonStore. String literals live here to prevent typos across the codebase.
export const DUNGEON_FLAGS = {
  // Multi-step event: Gambler's Coin (step 1) → Gambler's Ghost (step 2)
  GAMBLERS_COIN: 'gamblers_coin',

  // Boss dialogue outcomes
  BOSS_BYPASSED: 'boss_bypassed',           // Player talked their way past the boss
  BOSS_MECHANIC_HINT: 'boss_mechanic_hint', // Weakness was exposed via conversation

  // Per-boss loot cache grants (prevent double-grant per run)
  // Format: 'loot_cache_granted_<bossId>'
  // e.g. 'loot_cache_granted_vanya', 'loot_cache_granted_sorath'

  // Per-boss weakness reveals (prevent duplicate flags)
  // Format: 'weakness_revealed_<bossId>'
  // e.g. 'weakness_revealed_vanya', 'weakness_revealed_sorath'

  // Trap tracking (cleared per floor)
  TRIGGERED_TRAP: 'triggeredTrap',

  // Anomaly / special NPC flags
  ANOMALY_REGISTERED: 'anomalyRegistered',
  NOLUEITLA_ACTIVE: 'nolueitlaActive',
  SKAERVOX_CONTACTED: 'skaervoxContacted',
} as const;

export type DungeonFlag = typeof DUNGEON_FLAGS[keyof typeof DUNGEON_FLAGS];

// ===== ZONE NAMES =====
// Display names for each floor range of Johrvellia Tower.
export const ZONE_NAMES = {
  FLOOR_1_10: 'The Threshold',
  FLOOR_11_25: "Johr'ulf — The Wolf Continent",
  FLOOR_26_40: "Johr'ubi — The Bird Continent",
  FLOOR_41_60: "Johr'biike — The Bone Continent",
  FLOOR_61_80: "Johr'kuun — The Serpent Continent",
  FLOOR_81_99: "The Rutkean'i Core",
  FLOOR_100: 'Skaervox',
} as const;

// ===== DENATUS LEVEL 10 ALIGNMENT =====
// Alignment descriptor for Wilak (human) characters at Level 10 Denatus.
// Displayed in a muted color style — see the Denatus ceremony component for rendering.
// All player characters are Wilak, so this applies universally.
export const DENATUS_WILAK_ALIGNMENT = "kohr'feli—";  // Level 10 alignment label — muted color

// ===== MONSTER SCALING (relocated from Monster.ts in B-06) =====
// Single source of truth for floor/CR-based monster scaling. Monster.ts re-exports these names
// so existing importers keep working. B-15 (the Lycagon bands, D1) retunes this block — keep it
// the ONE place scaling lives. (Distinct from MonsterBalance above, which is a dead/legacy model.)

/** Floor ranges → target player level + HP/attack zone multiplier. */
export const PLAYER_LEVEL_FLOOR_ZONES: Array<{
  minFloor: number;
  maxFloor: number;
  targetPlayerLevel: number;
  zoneMultiplier: number;
}> = [
  { minFloor: 1,   maxFloor: 10,  targetPlayerLevel: 1, zoneMultiplier: 1.0 },
  { minFloor: 11,  maxFloor: 25,  targetPlayerLevel: 2, zoneMultiplier: 1.5 },
  { minFloor: 26,  maxFloor: 40,  targetPlayerLevel: 3, zoneMultiplier: 2.2 },
  { minFloor: 41,  maxFloor: 55,  targetPlayerLevel: 4, zoneMultiplier: 3.2 },
  { minFloor: 56,  maxFloor: 70,  targetPlayerLevel: 5, zoneMultiplier: 4.5 },
  { minFloor: 71,  maxFloor: 85,  targetPlayerLevel: 6, zoneMultiplier: 6.5 },
  { minFloor: 86,  maxFloor: 999, targetPlayerLevel: 7, zoneMultiplier: 9.0 },
];

/** CR-tier level multipliers for monster stat scaling (higher CR scales harder with floor). */
export const MONSTER_LEVEL_MULTIPLIERS = {
  earlyGame: 8,    // CR 0.5-2.0 — fast fights, 2-4 hits to kill
  midGame: 16,     // CR 2.1-5.0
  lateGame: 26,    // CR 5.1-10.0
  mythic: 36,      // CR 11+
} as const;

/** Stat scaling factors (multiplied by monsterLevel * levelMultiplier). */
export const MONSTER_STAT_SCALING = {
  hp: 1.0,         // Reduced so fights resolve in 3-5 hits, not 10+
  attack: 0.20,    // Higher threat per hit to compensate for lower HP
  defense: 0.1,
  magicDefense: 0.08,
  speed: 0.12,
} as const;
