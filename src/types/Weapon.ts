/**
 * Modular weapon system types for Kohrvellia
 * Structure: [Quality] + [Material] + [Base Weapon] + [Enchantment]
 */

import type { StatName } from './Stats';

// Weapon scales with one primary stat (all 8 stats represented)
export type WeaponCategory = 'STR' | 'AGI' | 'PER' | 'INT' | 'WIS' | 'CHA' | 'END' | 'LCK';

// Hybrid weapons scale with two stats simultaneously
export type HybridCategory =
  | 'STR_AGI' | 'STR_END' | 'STR_INT' | 'STR_PER' | 'STR_LCK'
  | 'AGI_PER' | 'AGI_LCK' | 'AGI_WIS' | 'AGI_INT'
  | 'INT_WIS' | 'INT_LCK'
  | 'WIS_END' | 'WIS_CHA'
  | 'PER_LCK' | 'CHA_WIS' | 'CHA_INT' | 'END_PER';

export type AnyWeaponCategory = WeaponCategory | HybridCategory;

// Weapon category descriptions for UI
export const WEAPON_CATEGORY_INFO: Record<WeaponCategory, { name: string; description: string }> = {
  STR: { name: 'Power', description: 'Heavy weapons that deal massive damage through raw strength.' },
  AGI: { name: 'Finesse', description: 'Light, fast weapons that strike quickly and precisely.' },
  PER: { name: 'Precision', description: 'Ranged weapons that reward careful aim and observation.' },
  INT: { name: 'Arcane', description: 'Magical implements that channel arcane energy.' },
  WIS: { name: 'Divine', description: 'Holy symbols and relics that channel spiritual power.' },
  CHA: { name: 'Performance', description: 'Weapons that weaponize presence and personality.' },
  END: { name: 'Guardian', description: 'Defensive weapons that punish attackers and protect allies.' },
  LCK: { name: 'Chaos', description: 'Unpredictable weapons with random but potentially devastating effects.' },
};

// Physical and elemental damage types
export type DamageType =
  | 'slash'
  | 'pierce'
  | 'blunt'
  | 'magic'
  | 'holy'
  | 'fire'
  | 'ice'
  | 'lightning'
  | 'poison'
  | 'dark';

// Material rarity tiers
export type MaterialTier = 'junk' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Quality affects reliability and crit
export type QualityTier = 'crude' | 'standard' | 'fine' | 'superior' | 'masterwork' | 'legendary';

// Enchantment power levels
export type EnchantmentTier = 'minor' | 'standard' | 'greater' | 'legendary';

// Stat requirement for equipping
export interface StatRequirement {
  stat: StatName;
  minGrade: string; // e.g., "D" means Grade D or higher
  minPoints?: number; // Optional: specific point threshold
}

// Level-gated: minLevel 1-8 = standard weapons, 9-10 = unique named weapons
// Use characterLevel param in generateRandomWeapon to filter available pool

// Base weapon definition (the core weapon type)
export interface BaseWeapon {
  id: string;
  name: string; // "Longsword", "Staff", "Bow"
  category: WeaponCategory;
  damageTypes: DamageType[]; // Can have multiple (e.g., slash + pierce)
  baseDamage: number;
  baseAccuracy: number;
  baseCritChance: number;
  attackSpeed: number; // 1.0 = normal, <1 = slow, >1 = fast
  range: 'melee' | 'ranged';
  twoHanded: boolean;
  requirements: StatRequirement[];
  minLevel?: number;        // Character level gate (1-10), undefined = level 1
  primaryStats?: WeaponCategory[]; // For hybrid weapons: the two scaling stats
  isUnique?: boolean;       // Level 9-10 named unique weapons
  specialMechanic?: string; // Description of unique mechanic (for uniques)
}

// Material modifies base stats
export interface WeaponMaterial {
  id: string;
  name: string; // "Iron", "Steel", "Mithril"
  tier: MaterialTier;
  damageModifier: number; // -0.2 to +1.0 (junk = -0.2, legendary = +1.0)
  durabilityModifier: number;
  weightModifier: number;
  minFloor: number; // Earliest floor this can drop
  description: string;
}

// Quality affects consistency and crits
export interface WeaponQuality {
  id: string;
  name: string; // "Crude", "Fine", "Masterwork"
  tier: QualityTier;
  accuracyModifier: number; // -10% to +10%
  critModifier: number; // 0% to +25%
  damageModifier: number; // -10% to +20%
  minFloor: number;
}

// Enchantment adds special effects
export interface EnchantmentEffect {
  type:
    | 'elemental_damage' // Add elemental damage
    | 'lifesteal' // Heal on hit
    | 'status_chance' // Chance to apply status
    | 'armor_pierce' // Ignore % defense
    | 'bonus_vs_type' // Extra damage vs creature type
    | 'on_kill' // Effect when killing
    | 'stat_boost' // Boost a stat while equipped
    | 'special'; // Unique effect
  value: number;
  element?: DamageType;
  statusEffect?: string;
  targetType?: string; // For bonus_vs_type
  description: string;
}

export interface WeaponEnchantment {
  id: string;
  name: string; // "of Flame", "of Dragonslaying"
  tier: EnchantmentTier;
  effects: EnchantmentEffect[];
  minFloor: number;
}

// Complete generated weapon instance
export interface Weapon {
  id: string; // Unique instance ID
  base: BaseWeapon;
  material: WeaponMaterial;
  quality: WeaponQuality;
  enchantment?: WeaponEnchantment;

  // Calculated final values
  finalDamage: number;
  finalAccuracy: number;
  finalCritChance: number;
  displayName: string; // "Fine Steel Longsword of Flame"

  // C2: Cap on total physical attack (stat + weapon). Scales with quality tier.
  // Optional for save-file backwards compatibility — missing = treated as Infinity.
  maxOutputCap?: number;

  // Durability (if implemented)
  durability?: { current: number; max: number };

  // For inventory/comparison
  rarity: MaterialTier; // Based on material tier
  floorFound: number;
  identified: boolean;
}

// ===== MATERIAL DATA =====

export const MATERIAL_TIERS: Record<MaterialTier, { modifier: number; minFloor: number }> = {
  junk: { modifier: -0.2, minFloor: 1 },
  common: { modifier: 0, minFloor: 1 },
  uncommon: { modifier: 0.1, minFloor: 6 },
  rare: { modifier: 0.25, minFloor: 11 },
  epic: { modifier: 0.5, minFloor: 36 },
  legendary: { modifier: 1.0, minFloor: 51 },
};

export const QUALITY_TIERS: Record<
  QualityTier,
  { accuracy: number; crit: number; damage: number; minFloor: number }
> = {
  crude: { accuracy: -0.1, crit: 0, damage: -0.1, minFloor: 1 },
  standard: { accuracy: 0, crit: 0, damage: 0, minFloor: 1 },
  fine: { accuracy: 0, crit: 0.05, damage: 0, minFloor: 6 },
  superior: { accuracy: 0, crit: 0.1, damage: 0.05, minFloor: 11 },
  masterwork: { accuracy: 0.05, crit: 0.15, damage: 0.1, minFloor: 21 },
  legendary: { accuracy: 0.1, crit: 0.25, damage: 0.2, minFloor: 41 },
};

/**
 * Multiplier applied to finalDamage to set the weapon's maxOutputCap.
 * Caps total physical attack (stat contribution + weapon damage) for that weapon.
 * Crude weapons cap low — legendary weapons scale with any stat investment.
 */
export const QUALITY_OUTPUT_CAP_MULTIPLIER: Record<QualityTier, number> = {
  crude: 1.5,
  standard: 3,
  fine: 5,
  superior: 8,
  masterwork: 15,
  legendary: 30,
};

// ===== UTILITY FUNCTIONS =====

/**
 * Generate display name for a weapon
 */
export function generateWeaponDisplayName(weapon: Weapon): string {
  const parts: string[] = [];

  // Quality (only if not standard)
  if (weapon.quality.tier !== 'standard') {
    parts.push(weapon.quality.name);
  }

  // Material (only if not common)
  if (weapon.material.tier !== 'common') {
    parts.push(weapon.material.name);
  }

  // Base weapon name
  parts.push(weapon.base.name);

  // Enchantment
  if (weapon.enchantment) {
    parts.push(weapon.enchantment.name);
  }

  return parts.join(' ');
}

/**
 * Calculate final weapon damage
 */
export function calculateWeaponDamage(
  baseDamage: number,
  material: WeaponMaterial,
  quality: WeaponQuality
): number {
  const materialMod = 1 + material.damageModifier;
  const qualityMod = 1 + quality.damageModifier;
  return Math.floor(baseDamage * materialMod * qualityMod);
}

/**
 * Get weapon triangle effectiveness
 * Slash → Strong vs Flesh, Weak vs Armor
 * Pierce → Strong vs Leather, Weak vs Bone
 * Blunt → Strong vs Bone/Armor, Weak vs Flesh
 */
export function getDamageEffectiveness(
  damageType: DamageType,
  targetArmorType: 'flesh' | 'leather' | 'bone' | 'armor' | 'spirit' | 'magic_resistant'
): number {
  const effectiveness: Record<DamageType, Record<string, number>> = {
    slash: { flesh: 1.5, leather: 1.0, bone: 0.75, armor: 0.75, spirit: 0.5, magic_resistant: 1.0 },
    pierce: { flesh: 1.0, leather: 1.5, bone: 0.75, armor: 1.0, spirit: 0.5, magic_resistant: 1.0 },
    blunt: { flesh: 0.75, leather: 1.0, bone: 1.5, armor: 1.5, spirit: 0.5, magic_resistant: 1.0 },
    magic: { flesh: 1.0, leather: 1.0, bone: 1.0, armor: 1.0, spirit: 1.5, magic_resistant: 0.5 },
    holy: { flesh: 1.0, leather: 1.0, bone: 1.5, armor: 1.0, spirit: 2.0, magic_resistant: 1.0 },
    fire: { flesh: 1.25, leather: 1.25, bone: 1.0, armor: 1.0, spirit: 1.0, magic_resistant: 0.75 },
    ice: { flesh: 1.0, leather: 1.0, bone: 1.25, armor: 1.25, spirit: 1.0, magic_resistant: 0.75 },
    lightning: { flesh: 1.25, leather: 1.0, bone: 1.0, armor: 1.25, spirit: 1.0, magic_resistant: 0.75 },
    poison: { flesh: 1.5, leather: 1.0, bone: 0, armor: 0, spirit: 0, magic_resistant: 1.0 },
    dark: { flesh: 1.0, leather: 1.0, bone: 1.0, armor: 1.0, spirit: 1.25, magic_resistant: 0.5 },
  };

  return effectiveness[damageType]?.[targetArmorType] ?? 1.0;
}
