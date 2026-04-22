/**
 * Shop system types for Kohrvellia
 * Defines shop inventory, pricing, and transaction types
 */

import type { Consumable as _Consumable } from './Consumable';
import type { Weapon } from './Weapon';
import type { Armor } from './Armor';

// ===== SHOP TYPES =====

export type ShopType = 'general' | 'equipment' | 'blacksmith';

// ===== STOCK ITEMS =====

export interface ConsumableStock {
  consumableId: string;
  quantity: number;  // -1 = unlimited
  basePrice: number;
}

export interface EquipmentStock {
  item: Weapon | Armor;
  basePrice: number;
  sold: boolean;
}

// ===== SHOP STATE =====

export interface ShopState {
  generalStock: ConsumableStock[];
  equipmentStock: EquipmentStock[];
  lastRefresh: number;
  deepestFloorAtRefresh: number;
  totalRunsAtRefresh: number;
}

// ===== PRICING =====

export const MATERIAL_BASE_PRICES: Record<string, number> = {
  junk: 10,
  common: 50,
  uncommon: 150,
  rare: 500,
  epic: 2000,
  legendary: 10000,
};

export const QUALITY_PRICE_MULTIPLIERS: Record<string, number> = {
  crude: 0.5,
  standard: 1.0,
  fine: 1.5,
  superior: 2.5,
  masterwork: 5.0,
  legendary: 15.0,
};

/**
 * Calculate the buy price for a weapon
 */
export function calculateWeaponPrice(weapon: Weapon): number {
  const materialTier = weapon.material?.tier || 'common';
  const qualityTier = weapon.quality?.tier || 'standard';

  const basePrice = MATERIAL_BASE_PRICES[materialTier] || 50;
  const qualityMult = QUALITY_PRICE_MULTIPLIERS[qualityTier] || 1.0;
  const enchantMult = weapon.enchantment ? 2.0 : 1.0;
  const statScale = 1 + (weapon.finalDamage / 100);

  return Math.floor(basePrice * qualityMult * enchantMult * statScale);
}

/**
 * Calculate the buy price for armor
 */
export function calculateArmorPrice(armor: Armor): number {
  const materialTier = armor.material?.tier || 'common';
  const qualityTier = armor.quality?.tier || 'standard';

  const basePrice = MATERIAL_BASE_PRICES[materialTier] || 50;
  const qualityMult = QUALITY_PRICE_MULTIPLIERS[qualityTier] || 1.0;
  const enchantMult = armor.enchantment ? 2.0 : 1.0;
  const defenseScale = 1 + (armor.finalDefense / 50);

  return Math.floor(basePrice * qualityMult * enchantMult * defenseScale);
}

/**
 * Calculate sell price (40% of buy price)
 */
export function calculateSellPrice(buyPrice: number): number {
  return Math.floor(buyPrice * 0.4);
}

// ===== REPUTATION DISCOUNTS =====

export interface ReputationDiscount {
  minRep: number;
  maxRep: number;
  discount: number;  // Positive = discount, negative = markup
}

export const REPUTATION_DISCOUNTS: ReputationDiscount[] = [
  { minRep: -20, maxRep: -10, discount: -1.00 },  // +100% markup (double price)
  { minRep: -9, maxRep: -5, discount: -0.50 },    // +50% markup
  { minRep: -4, maxRep: 5, discount: 0 },         // No change
  { minRep: 6, maxRep: 10, discount: 0.10 },      // 10% off
  { minRep: 11, maxRep: 15, discount: 0.25 },     // 25% off
  { minRep: 16, maxRep: 20, discount: 0.40 },     // 40% off
];

/**
 * Get price modifier based on NPC reputation
 */
export function getReputationDiscount(reputation: number): number {
  for (const tier of REPUTATION_DISCOUNTS) {
    if (reputation >= tier.minRep && reputation <= tier.maxRep) {
      return tier.discount;
    }
  }
  return 0;
}

/**
 * Apply reputation discount to a price
 */
export function applyReputationDiscount(basePrice: number, reputation: number): number {
  const discount = getReputationDiscount(reputation);
  return Math.floor(basePrice * (1 - discount));
}

// ===== TRANSACTION TYPES =====

export interface PurchaseResult {
  success: boolean;
  reason?: string;
  goldSpent?: number;
  itemId?: string;
}

export interface SellResult {
  success: boolean;
  reason?: string;
  goldGained?: number;
}

// ===== SHOP NPC =====

export interface ShopNPC {
  id: string;
  name: string;
  shopType: ShopType;
  greeting: string;
  farewell: string;
  icon: string;
}

export const SHOP_NPCS: Record<ShopType, ShopNPC> = {
  general: {
    id: 'merchant_general',
    name: 'Mira',
    shopType: 'general',
    greeting: "Welcome, adventurer! I've got potions, food, and supplies for your journey.",
    farewell: "Safe travels! Come back when you need to restock.",
    icon: '🛒',
  },
  equipment: {
    id: 'merchant_equipment',
    name: 'Forge',
    shopType: 'equipment',
    greeting: "Looking for weapons and armor? You've come to the right place.",
    farewell: "May your new gear serve you well in battle!",
    icon: '🗡️',
  },
  blacksmith: {
    id: 'blacksmith',
    name: 'Garm',
    shopType: 'blacksmith',
    greeting: "Need something identified or upgraded? I'm your dwarf.",
    farewell: "Bring me more work anytime. I live for the forge!",
    icon: '🔨',
  },
};
