/**
 * Modular monster system for Kohrvellia
 * Structure: [Prefix] + [Base Monster] + [Suffix]
 * Each component adds to the monster's Challenge Rating (CR)
 */

import type { DamageType } from './Weapon';
import type { StatusEffectId } from './Character';

// Monster armor types for damage calculation
export type MonsterArmorType =
  | 'flesh'      // Soft tissue, normal damage
  | 'leather'    // Light armor, slight physical resist
  | 'bone'       // Skeletal, resist pierce/slash, weak to blunt
  | 'armor'      // Medium armor
  | 'plate'      // Heavy armor, high physical resist
  | 'scales'     // Dragon/reptile scales, balanced resist
  | 'spirit'     // Ghostly, resist physical
  | 'ethereal'   // Intangible, high physical resist
  | 'magic_resistant'; // Resist magical damage

// Monster behavior AI patterns
export type BehaviorPattern =
  | 'aggressive' // Always attacks
  | 'defensive' // Prioritizes defense when hurt
  | 'cowardly' // Flees when low HP
  | 'berserker' // More dangerous when low HP
  | 'summoner' // Summons allies
  | 'caster' // Prefers magic
  | 'support' // Buffs allies
  | 'ambusher' // High first-strike damage
  | 'regenerator'; // Heals over time

// Prefix tiers for monster enhancement
export type PrefixTier = 'negative' | 'low' | 'mid' | 'high' | 'legendary';

// Suffix tiers
export type SuffixTier = 'low' | 'mid' | 'high' | 'legendary';

// Monster prefix (modifies stats)
export interface MonsterPrefix {
  id: string;
  name: string; // "Elite", "Ancient", "Mythic"
  tier: PrefixTier;
  crModifier: number; // CR bonus/penalty
  statModifiers: {
    hp?: number; // Multiplier (1.5 = +50%)
    attack?: number;
    defense?: number;
    speed?: number;
    accuracy?: number;
  };
  specialAbility?: string; // ID of special ability granted
  minFloor: number; // Earliest floor this prefix appears
}

// Monster suffix (adds elemental/special effects)
export interface MonsterSuffix {
  id: string;
  name: string; // "of Flame", "the Undying"
  tier: SuffixTier;
  crModifier: number;
  damageType?: DamageType; // Adds this damage type to attacks
  bonusDamage?: number;
  statusChance?: number; // % chance to apply status
  statusEffect?: StatusEffectId;
  passiveAbility?: string;
  minFloor: number;
}

// Base monster definition
export interface BaseMonster {
  id: string;
  name: string; // "Goblin", "Dragon", "Skeleton"

  // Combat stats
  baseCR: number;
  baseHP: number;
  baseAttack: number;
  baseDefense: number;
  baseMagicDefense: number;
  baseSpeed: number;
  baseAccuracy: number;
  baseInitiative?: number; // Optional: defaults to floor(baseSpeed * 0.7 + 2) if not set

  // Damage profile
  damageTypes: DamageType[];
  armorType: MonsterArmorType;

  // Resistances and weaknesses
  weaknesses: DamageType[];
  resistances: DamageType[];
  immunities: DamageType[];

  // Behavior
  behaviorPattern: BehaviorPattern;
  canFlee: boolean;
  fleeThreshold: number; // HP % to flee

  // Loot
  goldDrop: { min: number; max: number };
  xpValue: number;
  lootTable: string; // Reference to loot table ID

  // Metadata
  description: string;
  category: string; // "beast", "undead", "demon", "humanoid", "elemental", "dragon"
  biomes: string[]; // Where this monster spawns
  minFloor: number;
  maxFloor?: number;
}

// Skills/abilities a monster can use
export interface MonsterAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  damageMultiplier?: number;
  effectChance?: number;
  effectId?: StatusEffectId;
  targeting: 'single' | 'aoe' | 'self' | 'ally';
  triggerCondition?: string; // When AI uses this (e.g., "hp < 50%")
}

// Complete generated monster instance
export interface Monster {
  instanceId: string; // Unique per encounter
  base: BaseMonster;
  prefix?: MonsterPrefix;
  suffix?: MonsterSuffix;

  // Calculated final values
  finalCR: number;
  maxHP: number;
  currentHP: number;
  attack: number;
  defense: number;
  magicDefense: number;
  speed: number;
  accuracy: number;
  initiative: number; // Combat priority for planned-turn system

  // Display
  displayName: string; // "Elite Goblin of Flame"

  // Combat state
  statusEffects: { id: StatusEffectId; duration: number }[];
  abilityCooldowns: Record<string, number>;
  turnsInCombat: number;

  // Special flags
  isBoss: boolean;
  isElite: boolean;
  isPantheonSpecific: boolean;
  pantheonId?: string;
}

// ===== PREFIX DATA =====

export const PREFIX_TIERS: Record<PrefixTier, { crMod: number; statMod: number; minFloor: number }> = {
  negative: { crMod: -0.3, statMod: 0.7, minFloor: 1 },
  low: { crMod: 0.3, statMod: 1.1, minFloor: 1 },
  mid: { crMod: 0.5, statMod: 1.25, minFloor: 6 },
  high: { crMod: 1.0, statMod: 1.5, minFloor: 11 },
  legendary: { crMod: 2.0, statMod: 2.0, minFloor: 41 },
};

export const SUFFIX_TIERS: Record<SuffixTier, { crMod: number; minFloor: number }> = {
  low: { crMod: 0.3, minFloor: 1 },
  mid: { crMod: 0.5, minFloor: 11 },
  high: { crMod: 1.0, minFloor: 31 },
  legendary: { crMod: 2.0, minFloor: 51 },
};

/**
 * Floor gates for dangerous status effect suffixes
 * Prevents unfair combos on early floors where players lack counters
 */
export const SUFFIX_FLOOR_GATES: Record<string, number> = {
  burning: 4,      // No burn until Floor 4 (healing reduction too punishing early)
  venomous: 4,     // No poison until Floor 4
  chilling: 6,     // No freeze until Floor 6 (turn skip is brutal)
  freezing: 6,     // Alias for chilling
  stunning: 10,    // No stun until Floor 10 (guaranteed turn skip)
  cursed: 8,       // No curse until Floor 8 (stat reduction + healing block)
  corrupting: 8,   // Alias for cursed
};

// Floor-based affix rules
// Note: maxPrefixTier/maxSuffixTier use 'negative'/'low' as placeholders when maxAffixes is 0
export const FLOOR_AFFIX_RULES: Array<{
  minFloor: number;
  maxFloor: number;
  maxAffixes: number;
  maxPrefixTier: PrefixTier;
  maxSuffixTier: SuffixTier;
  maxBaseCR?: number; // Optional cap on base monster CR for this floor range
}> = [
  // SAFE ZONE: Floors 1-3 have NO affixes at all - pure base monsters only
  { minFloor: 1, maxFloor: 3, maxAffixes: 0, maxPrefixTier: 'negative', maxSuffixTier: 'low', maxBaseCR: 0.8 },
  // TRAINING ZONE: Floors 4-5 allow weak negative prefixes only (Weak/Young)
  { minFloor: 4, maxFloor: 5, maxAffixes: 1, maxPrefixTier: 'negative', maxSuffixTier: 'low' },
  // Status effects start appearing (gated by SUFFIX_FLOOR_GATES)
  { minFloor: 6, maxFloor: 10, maxAffixes: 1, maxPrefixTier: 'low', maxSuffixTier: 'low' },
  { minFloor: 11, maxFloor: 20, maxAffixes: 1, maxPrefixTier: 'mid', maxSuffixTier: 'mid' },
  { minFloor: 21, maxFloor: 30, maxAffixes: 2, maxPrefixTier: 'mid', maxSuffixTier: 'mid' },
  { minFloor: 31, maxFloor: 40, maxAffixes: 2, maxPrefixTier: 'high', maxSuffixTier: 'high' },
  { minFloor: 41, maxFloor: 50, maxAffixes: 2, maxPrefixTier: 'high', maxSuffixTier: 'high' },
  { minFloor: 51, maxFloor: 999, maxAffixes: 3, maxPrefixTier: 'legendary', maxSuffixTier: 'legendary' },
];

// ===== FLOOR ZONE TABLE =====

/**
 * Maps floor ranges to target player levels with zone multipliers.
 * With the additive carry model, player power grows faster than linear across levels.
 * Zone multipliers ensure monsters remain a meaningful challenge in each level's zone.
 *
 * Zone multiplier applies to HP and attack only — not defense, to keep combat
 * time reasonable while maintaining danger at each tier.
 */
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

/**
 * Get zone multiplier for a given floor.
 * Used in calculateMonsterEffectiveStats() to scale HP and attack.
 */
export function getFloorZoneMultiplier(floor: number): number {
  return PLAYER_LEVEL_FLOOR_ZONES.find(
    (z) => floor >= z.minFloor && floor <= z.maxFloor
  )?.zoneMultiplier ?? 1.0;
}

// ===== MONSTER LEVEL SCALING =====

/**
 * CR tier level multipliers for monster stat scaling
 * Higher CR monsters scale more aggressively with floor
 */
export const MONSTER_LEVEL_MULTIPLIERS = {
  earlyGame: 8,    // CR 0.5-2.0 — fast fights, 2-4 hits to kill
  midGame: 16,     // CR 2.1-5.0
  lateGame: 26,    // CR 5.1-10.0
  mythic: 36,      // CR 11+
} as const;

/**
 * Stat scaling factors (multiplied by monsterLevel * levelMultiplier)
 */
export const MONSTER_STAT_SCALING = {
  hp: 1.0,         // Reduced so fights resolve in 3-5 hits, not 10+
  attack: 0.20,    // Higher threat per hit to compensate for lower HP
  defense: 0.1,
  magicDefense: 0.08,
  speed: 0.12,
} as const;

/**
 * Calculate effective monster level based on floor and CR modifiers
 * CR modifiers from prefix/suffix translate to bonus levels
 */
export function getMonsterLevel(floor: number, baseCR: number, finalCR: number): number {
  const crBonus = (finalCR - baseCR) * 2;
  return Math.max(1, floor + crBonus);
}

/**
 * Get level multiplier based on monster CR tier
 * Higher CR monsters scale more aggressively
 */
export function getMonsterLevelMultiplier(baseCR: number): number {
  if (baseCR < 2.0) return MONSTER_LEVEL_MULTIPLIERS.earlyGame;
  if (baseCR < 5.0) return MONSTER_LEVEL_MULTIPLIERS.midGame;
  if (baseCR < 10.0) return MONSTER_LEVEL_MULTIPLIERS.lateGame;
  return MONSTER_LEVEL_MULTIPLIERS.mythic;
}

/**
 * Calculate monster effective stats with floor-based level scaling
 * This ensures monsters scale with dungeon depth, not just base stats
 */
export function calculateMonsterEffectiveStats(
  base: BaseMonster,
  monsterLevel: number,
  levelMultiplier: number,
  zoneMultiplier: number = 1.0
): {
  hp: number;
  attack: number;
  defense: number;
  magicDefense: number;
  speed: number;
} {
  // Zone multiplier scales HP and attack to match player carry power at that floor range.
  // Defense is intentionally NOT zone-scaled to keep combat time reasonable.
  const rawHP = (monsterLevel * levelMultiplier * MONSTER_STAT_SCALING.hp) + base.baseHP;
  const rawAtk = (monsterLevel * levelMultiplier * MONSTER_STAT_SCALING.attack) + base.baseAttack;
  return {
    hp: Math.floor(rawHP * zoneMultiplier),
    attack: Math.floor(rawAtk * zoneMultiplier),
    defense: Math.floor((monsterLevel * levelMultiplier * MONSTER_STAT_SCALING.defense) + base.baseDefense),
    magicDefense: Math.floor((monsterLevel * levelMultiplier * MONSTER_STAT_SCALING.magicDefense) + base.baseMagicDefense),
    speed: Math.floor((monsterLevel * levelMultiplier * MONSTER_STAT_SCALING.speed) + base.baseSpeed),
  };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Generate display name: "[Prefix] [Base] [Suffix]"
 */
export function generateMonsterDisplayName(monster: Monster): string {
  const parts: string[] = [];

  if (monster.prefix) {
    parts.push(monster.prefix.name);
  }

  parts.push(monster.base.name);

  if (monster.suffix) {
    parts.push(monster.suffix.name);
  }

  return parts.join(' ');
}

/**
 * Status effect CR weights - dangerous effects add hidden threat
 * These weights reflect the true danger of status effects in combat
 */
export const STATUS_EFFECT_CR_WEIGHTS: Record<string, number> = {
  poison: 0.4,    // Consistent damage over time
  burn: 0.6,      // DPS + 50% healing reduction = very dangerous
  bleed: 0.5,     // Stacking potential
  freeze: 0.8,    // Turn skip + accuracy penalty
  stun: 1.2,      // Guaranteed turn skip
  blind: 0.3,     // Only impacts accuracy builds
  weaken: 0.2,    // Reduces offense, not direct damage
  slow: 0.25,     // Movement penalty
  curse: 0.9,     // Stat reduction + healing block
};

/**
 * Calculate additional CR modifier from status effects
 * Status effects add hidden threat not reflected in base suffix CR
 */
export function calculateStatusEffectCRModifier(suffix?: MonsterSuffix): number {
  if (!suffix?.statusEffect) return 0;

  const weight = STATUS_EFFECT_CR_WEIGHTS[suffix.statusEffect] || 0;
  const chance = suffix.statusChance || 20;

  // Scale by application chance (100% chance = full weight)
  return weight * (chance / 100);
}

/**
 * Calculate final CR from base + affixes + status effect weighting
 */
export function calculateMonsterCR(
  base: BaseMonster,
  prefix?: MonsterPrefix,
  suffix?: MonsterSuffix
): number {
  let cr = base.baseCR;

  if (prefix) cr += prefix.crModifier;
  if (suffix) {
    cr += suffix.crModifier;
    cr += calculateStatusEffectCRModifier(suffix); // Add status effect threat
  }

  return Math.round(Math.max(0.1, cr) * 100) / 100; // Minimum 0.1 CR, max 2 decimal places
}

/**
 * Calculate final HP with prefix modifiers
 */
export function calculateMonsterHP(base: BaseMonster, prefix?: MonsterPrefix): number {
  const hpMod = prefix?.statModifiers.hp ?? 1;
  return Math.floor(base.baseHP * hpMod);
}

/**
 * Calculate final attack with prefix modifiers
 */
export function calculateMonsterAttack(base: BaseMonster, prefix?: MonsterPrefix): number {
  const attackMod = prefix?.statModifiers.attack ?? 1;
  return Math.floor(base.baseAttack * attackMod);
}

/**
 * Calculate final defense with prefix modifiers
 */
export function calculateMonsterDefense(base: BaseMonster, prefix?: MonsterPrefix): number {
  const defenseMod = prefix?.statModifiers.defense ?? 1;
  return Math.floor(base.baseDefense * defenseMod);
}

/**
 * Get danger level indicator for UI
 */
export function getDangerLevel(
  playerLevel: number,
  monsterCR: number
): 'trivial' | 'easy' | 'normal' | 'hard' | 'deadly' | 'suicidal' {
  const expectedCR = playerLevel * 2.5;
  const ratio = monsterCR / expectedCR;

  if (ratio < 0.6) return 'trivial';
  if (ratio < 0.9) return 'easy';
  if (ratio < 1.1) return 'normal';
  if (ratio < 1.4) return 'hard';
  if (ratio < 1.8) return 'deadly';
  return 'suicidal';
}

/**
 * Get floor-appropriate affix rules
 */
export function getAffixRulesForFloor(floor: number) {
  for (const rule of FLOOR_AFFIX_RULES) {
    if (floor >= rule.minFloor && floor <= rule.maxFloor) {
      return rule;
    }
  }
  // Default to highest tier for floors beyond defined ranges
  return FLOOR_AFFIX_RULES[FLOOR_AFFIX_RULES.length - 1];
}

/**
 * Check if monster is elite (has high+ prefix)
 */
export function isEliteMonster(monster: Monster): boolean {
  if (!monster.prefix) return false;
  return monster.prefix.tier === 'high' || monster.prefix.tier === 'legendary';
}

/**
 * Check if monster is boss (has both prefix and suffix)
 */
export function isBossMonster(monster: Monster): boolean {
  return monster.prefix !== undefined && monster.suffix !== undefined;
}

/**
 * Calculate gold drop with CR scaling
 */
export function calculateGoldDrop(monster: Monster): number {
  const base = monster.base.goldDrop;
  const baseGold = Math.floor(Math.random() * (base.max - base.min + 1)) + base.min;
  const crMultiplier = monster.finalCR / monster.base.baseCR;
  return Math.floor(baseGold * crMultiplier);
}

/**
 * Create a fresh monster instance with floor-based scaling
 * @param floor - The dungeon floor number (affects monster power scaling)
 */
export function createMonsterInstance(
  base: BaseMonster,
  prefix?: MonsterPrefix,
  suffix?: MonsterSuffix,
  floor: number = 1
): Monster {
  const finalCR = calculateMonsterCR(base, prefix, suffix);

  // Calculate monster level from floor and CR
  const monsterLevel = getMonsterLevel(floor, base.baseCR, finalCR);
  const levelMultiplier = getMonsterLevelMultiplier(base.baseCR);

  // Get floor zone multiplier — scales HP and attack to match carry-forward player power
  const zoneMult = getFloorZoneMultiplier(floor);

  // Get floor-scaled effective stats BEFORE applying prefix multipliers
  const effectiveStats = calculateMonsterEffectiveStats(base, monsterLevel, levelMultiplier, zoneMult);

  // Apply prefix multipliers to the scaled stats (not raw base stats)
  const maxHP = Math.floor(effectiveStats.hp * (prefix?.statModifiers.hp ?? 1));
  const attack = Math.floor(effectiveStats.attack * (prefix?.statModifiers.attack ?? 1));
  const defense = Math.floor(effectiveStats.defense * (prefix?.statModifiers.defense ?? 1));
  const speed = Math.floor(effectiveStats.speed * (prefix?.statModifiers.speed ?? 1));
  // Initiative: use baseInitiative if set, else derive from baseSpeed (fast monsters act first)
  const baseInit = base.baseInitiative ?? Math.floor(base.baseSpeed * 0.7 + 2);
  const initiative = Math.floor(baseInit * (prefix?.statModifiers.speed ?? 1));

  const monster: Monster = {
    instanceId: `monster_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    base,
    prefix,
    suffix,

    finalCR,
    maxHP,
    currentHP: maxHP,
    attack,
    defense,
    magicDefense: effectiveStats.magicDefense,
    speed,
    accuracy: Math.floor(base.baseAccuracy * (prefix?.statModifiers.accuracy ?? 1)),
    initiative,

    displayName: '',
    statusEffects: [],
    abilityCooldowns: {},
    turnsInCombat: 0,

    isBoss: false,
    isElite: false,
    isPantheonSpecific: false,
  };

  monster.displayName = generateMonsterDisplayName(monster);
  monster.isElite = isEliteMonster(monster);
  monster.isBoss = isBossMonster(monster);

  return monster;
}

/**
 * Check if a suffix is allowed on a given floor based on floor gates
 * Used by monster generation to prevent dangerous status effects on early floors
 */
export function isSuffixAllowedOnFloor(suffixId: string, floor: number): boolean {
  const floorGate = SUFFIX_FLOOR_GATES[suffixId.toLowerCase()] || 1;
  return floor >= floorGate;
}

/**
 * Get swarm/multi-attack threat multiplier for CR calculation
 * Swarms deal more effective damage due to multiple attacks per turn
 */
export function getSwarmThreatMultiplier(monster: BaseMonster): number {
  // Check if monster is a swarm type (multiple attacks increase effective DPS)
  const isSwarm = monster.id.toLowerCase().includes('swarm') ||
                  monster.name.toLowerCase().includes('swarm');

  if (isSwarm) {
    return 1.3; // 30% threat increase for swarms
  }

  return 1.0;
}

/**
 * Calculate effective CR including swarm threat multiplier
 * Use this for danger level calculations and encounter balancing
 */
export function calculateEffectiveThreatCR(monster: Monster): number {
  const swarmMultiplier = getSwarmThreatMultiplier(monster.base);
  return monster.finalCR * swarmMultiplier;
}
