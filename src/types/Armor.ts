/**
 * Armor and accessory types for Kohrvellia
 * Reuses material/quality/enchantment systems from weapons
 */

import type { WeaponMaterial, WeaponQuality, WeaponEnchantment, MaterialTier } from './Weapon';

// Equipment slots for armor
export type ArmorSlot = 'head' | 'chest' | 'hands' | 'legs';

// Armor weight classes affect mobility
export type ArmorType = 'light' | 'medium' | 'heavy' | 'robes';

// Armor type stats
export const ARMOR_TYPE_STATS: Record<
  ArmorType,
  {
    defenseMultiplier: number;
    magicDefMultiplier: number;
    speedPenalty: number;
    dodgePenalty: number;
    bestFor: string;
  }
> = {
  light: {
    defenseMultiplier: 0.6,
    magicDefMultiplier: 0.6,
    speedPenalty: 0,
    dodgePenalty: 0,
    bestFor: 'AGI, PER builds',
  },
  medium: {
    defenseMultiplier: 1.0,
    magicDefMultiplier: 1.0,
    speedPenalty: -0.1,
    dodgePenalty: -0.05,
    bestFor: 'Balanced builds',
  },
  heavy: {
    defenseMultiplier: 1.5,
    magicDefMultiplier: 0.5,
    speedPenalty: -0.25,
    dodgePenalty: -0.15,
    bestFor: 'STR, END builds',
  },
  robes: {
    defenseMultiplier: 0.3,
    magicDefMultiplier: 1.5,
    speedPenalty: 0,
    dodgePenalty: 0,
    bestFor: 'INT, WIS builds',
  },
};

// Base armor piece definition
export interface BaseArmor {
  id: string;
  name: string; // "Plate Helm", "Leather Vest", "Wizard Robes"
  slot: ArmorSlot;
  type: ArmorType;
  baseDefense: number;
  baseMagicDefense: number;
  weight: number;
}

// Complete armor instance
export interface Armor {
  id: string;
  base: BaseArmor;
  material: WeaponMaterial; // Reuse weapon material system
  quality: WeaponQuality;
  enchantment?: WeaponEnchantment;

  // Calculated final values
  finalDefense: number;
  finalMagicDefense: number;
  speedPenalty: number;
  dodgePenalty: number;
  displayName: string;

  // Metadata
  rarity: MaterialTier;
  floorFound: number;
  identified: boolean;
}

// Accessory slot types
export type AccessorySlot = 'accessory1' | 'accessory2';
export type AccessoryType = 'ring' | 'amulet' | 'charm' | 'belt' | 'cloak';

// Effect types for accessories
export interface AccessoryEffect {
  type:
    | 'stat_boost' // +X to a stat
    | 'resistance' // Resist element/status
    | 'regen' // HP/SP regen
    | 'bonus_damage' // +% damage type
    | 'special'; // Unique effect
  stat?: string;
  element?: string;
  value: number;
  description: string;
}

// Accessory definition
export interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  effects: AccessoryEffect[];
  rarity: MaterialTier;
  floorFound: number;
  identified: boolean;
  loreText?: string;
}

// Full equipment loadout
export interface Equipment {
  weapon: import('./Weapon').Weapon | null;
  head: Armor | null;
  chest: Armor | null;
  hands: Armor | null;
  legs: Armor | null;
  accessory1: Accessory | null;
  accessory2: Accessory | null;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Calculate total equipment defense
 */
export function calculateTotalDefense(equipment: Equipment): number {
  let total = 0;
  const armorSlots: (keyof Equipment)[] = ['head', 'chest', 'hands', 'legs'];

  for (const slot of armorSlots) {
    const armor = equipment[slot] as Armor | null;
    if (armor) {
      total += armor.finalDefense;
    }
  }

  return total;
}

/**
 * Calculate total magic defense from equipment
 */
export function calculateTotalMagicDefense(equipment: Equipment): number {
  let total = 0;
  const armorSlots: (keyof Equipment)[] = ['head', 'chest', 'hands', 'legs'];

  for (const slot of armorSlots) {
    const armor = equipment[slot] as Armor | null;
    if (armor) {
      total += armor.finalMagicDefense;
    }
  }

  return total;
}

/**
 * Calculate total speed penalty from armor
 */
export function calculateSpeedPenalty(equipment: Equipment): number {
  let penalty = 0;
  const armorSlots: (keyof Equipment)[] = ['head', 'chest', 'hands', 'legs'];

  for (const slot of armorSlots) {
    const armor = equipment[slot] as Armor | null;
    if (armor) {
      penalty += armor.speedPenalty;
    }
  }

  return penalty;
}

/**
 * Generate armor display name
 */
export function generateArmorDisplayName(armor: Armor): string {
  const parts: string[] = [];

  if (armor.quality.tier !== 'standard') {
    parts.push(armor.quality.name);
  }

  if (armor.material.tier !== 'common') {
    parts.push(armor.material.name);
  }

  parts.push(armor.base.name);

  if (armor.enchantment) {
    parts.push(armor.enchantment.name);
  }

  return parts.join(' ');
}

/**
 * Create empty equipment loadout
 */
export function createEmptyEquipment(): Equipment {
  return {
    weapon: null,
    head: null,
    chest: null,
    hands: null,
    legs: null,
    accessory1: null,
    accessory2: null,
  };
}
