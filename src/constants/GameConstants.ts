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

// Derived stat formulas
export const DerivedStatFormulas = {
  hp: {
    base: 50,
    endMultiplier: 0.1,
    strMultiplier: 0.02,
  },
  sp: {
    base: 30,
    wisMultiplier: 0.06,
    intMultiplier: 0.04,
  },
  physicalAttack: {
    strMultiplier: 0.08,
  },
  magicAttack: {
    intMultiplier: 0.08,
    wisMultiplier: 0.02,
  },
  physicalDefense: {
    endMultiplier: 0.06,
  },
  magicDefense: {
    wisMultiplier: 0.08,
  },
  speed: {
    agiMultiplier: 0.1,
    perMultiplier: 0.02,
  },
  critChance: {
    base: 5,
    lckMultiplier: 0.004,
    perMultiplier: 0.002,
  },
  dodgeChance: {
    agiMultiplier: 0.006,
    perMultiplier: 0.002,
  },
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
