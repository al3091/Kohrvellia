/**
 * Loot system types
 * Defines monster-category-based loot pools
 */

import type { WeaponCategory } from './Weapon';

// Monster categories that can appear in the game
export type MonsterCategory =
  | 'humanoid'
  | 'undead'
  | 'beast'
  | 'elemental'
  | 'aberration'
  | 'demon'
  | 'giant'
  | 'dragon';

// Material types that can drop from monsters
export type MaterialType =
  | 'hide'
  | 'fang'
  | 'claw'
  | 'bone'
  | 'cloth'
  | 'leather'
  | 'ectoplasm'
  | 'essence'
  | 'crystal'
  | 'scale'
  | 'horn'
  | 'demon_essence'
  | 'strange_flesh'
  | 'eye'
  | 'giant_bone'
  | 'raw_meat';

// A loot pool defines what a monster category can drop
export interface LootPool {
  // Weapon categories this monster can drop (empty = no weapons)
  weaponCategories: WeaponCategory[];
  // Materials this monster can drop
  materials: MaterialType[];
  // Consumable IDs this monster can drop
  consumables: string[];
  // Base weapon drop chance modifier (0 = never, 1 = normal, 2 = double)
  weaponDropModifier: number;
  // Extra gold modifier
  goldModifier: number;
}

// Result of generating loot for a monster
export interface LootResult {
  gold: number;
  xp: number;
  weaponDrop?: {
    category: WeaponCategory;
    floorLevel: number;
  };
  materials: MaterialType[];
  consumables: string[];
}
