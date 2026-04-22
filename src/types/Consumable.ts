/**
 * Consumable item types for Kohrvellia
 * Defines potions, food, and other usable items
 */

import type { StatName } from './Stats';

// Effect types for consumables
export type ConsumableEffectType =
  | 'heal_hp'           // Flat HP heal
  | 'heal_sp'           // Flat SP heal
  | 'heal_percent_hp'   // Percentage HP heal
  | 'heal_percent_sp'   // Percentage SP heal
  | 'cure_poison'       // Remove poison status
  | 'cure_bleed'        // Remove bleed status
  | 'cure_all'          // Remove all negative status effects
  | 'buff'              // Apply temporary buff
  | 'damage'            // Deal damage (bombs, etc.)
  | 'flee'              // Guaranteed escape
  | 'reveal'            // Reveal map/enemies
  | 'identify';         // Identify unknown items

// Buff effect details
export interface BuffEffect {
  name: string;
  stat?: StatName;
  value: number;
  description?: string;
}

// Consumable effect definition
export interface ConsumableEffect {
  type: ConsumableEffectType;
  value: number;
  duration?: number;        // For buffs, in turns
  buffEffect?: BuffEffect;  // Details for buff type
}

// Consumable rarity
export type ConsumableRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Full consumable definition
export interface Consumable {
  id: string;
  name: string;
  description: string;
  rarity: ConsumableRarity;

  // Effect when used
  effect: ConsumableEffect;

  // Usage restrictions
  usableInCombat: boolean;
  usableOutOfCombat: boolean;

  // Shop data
  buyPrice: number;
  sellPrice: number;

  // Availability
  minFloor: number;          // Minimum floor to find/buy
  dropWeight: number;        // Relative drop chance (higher = more common)

  // Satiation — food items restore hunger tokens when consumed outside of rest sites
  satiationRestore?: number; // Satiation points restored (0-100 scale)

  // Visual
  icon?: string;             // Emoji or icon name
  color?: string;            // Theme color
}

// ===== CONSUMABLE CONSTANTS =====

export const RARITY_COLORS: Record<ConsumableRarity, string> = {
  common: '#9CA3AF',    // Gray
  uncommon: '#10B981',  // Green
  rare: '#3B82F6',      // Blue
  epic: '#8B5CF6',      // Purple
  legendary: '#F59E0B', // Gold
};

export const RARITY_MULTIPLIERS: Record<ConsumableRarity, number> = {
  common: 1.0,
  uncommon: 1.5,
  rare: 2.0,
  epic: 3.0,
  legendary: 5.0,
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get display name for effect type
 */
export function getEffectTypeName(type: ConsumableEffectType): string {
  const names: Record<ConsumableEffectType, string> = {
    heal_hp: 'Restore HP',
    heal_sp: 'Restore SP',
    heal_percent_hp: 'Restore HP %',
    heal_percent_sp: 'Restore SP %',
    cure_poison: 'Cure Poison',
    cure_bleed: 'Stop Bleeding',
    cure_all: 'Cure All',
    buff: 'Buff',
    damage: 'Damage',
    flee: 'Escape',
    reveal: 'Reveal',
    identify: 'Identify',
  };
  return names[type] || type;
}

/**
 * Format effect for display
 */
export function formatConsumableEffect(effect: ConsumableEffect): string {
  switch (effect.type) {
    case 'heal_hp':
      return `Restore ${effect.value} HP`;
    case 'heal_sp':
      return `Restore ${effect.value} SP`;
    case 'heal_percent_hp':
      return `Restore ${effect.value}% HP`;
    case 'heal_percent_sp':
      return `Restore ${effect.value}% SP`;
    case 'cure_poison':
      return 'Cure poison';
    case 'cure_bleed':
      return 'Stop bleeding';
    case 'cure_all':
      return 'Cure all status effects';
    case 'buff':
      if (effect.buffEffect) {
        return `+${effect.buffEffect.value} ${effect.buffEffect.stat || effect.buffEffect.name} for ${effect.duration} turns`;
      }
      return 'Temporary buff';
    case 'damage':
      return `Deal ${effect.value} damage`;
    case 'flee':
      return 'Guaranteed escape from battle';
    case 'reveal':
      return 'Reveal hidden areas';
    case 'identify':
      return 'Identify unknown item';
    default:
      return 'Unknown effect';
  }
}

/**
 * Check if consumable can be used in current context
 */
export function canUseConsumable(
  consumable: Consumable,
  inCombat: boolean
): { canUse: boolean; reason?: string } {
  if (inCombat && !consumable.usableInCombat) {
    return { canUse: false, reason: 'Cannot use in combat' };
  }
  if (!inCombat && !consumable.usableOutOfCombat) {
    return { canUse: false, reason: 'Can only use in combat' };
  }
  return { canUse: true };
}
