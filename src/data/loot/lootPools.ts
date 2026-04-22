/**
 * Monster Category Loot Pools
 * Defines what each monster type can drop
 */

import type { MonsterCategory, LootPool, MaterialType } from '../../types/Loot';
import type { WeaponCategory } from '../../types/Weapon';

// Loot pools for each monster category
export const MONSTER_LOOT_POOLS: Record<MonsterCategory, LootPool> = {
  // Humanoids carry weapons and equipment
  humanoid: {
    weaponCategories: ['STR', 'AGI', 'PER', 'END'], // Physical weapons
    materials: ['cloth', 'leather'],
    consumables: ['health_potion_small', 'bread'],
    weaponDropModifier: 1.0,
    goldModifier: 1.2, // Humanoids carry more gold
  },

  // Undead carry the weapons they died with
  undead: {
    weaponCategories: ['STR', 'END'], // Swords, axes, shields
    materials: ['bone', 'ectoplasm'],
    consumables: [],
    weaponDropModifier: 0.7, // Weapons are often decayed
    goldModifier: 0.8, // Less gold on corpses
  },

  // Beasts don't carry weapons
  beast: {
    weaponCategories: [], // No weapons
    materials: ['hide', 'fang', 'claw', 'raw_meat'],
    consumables: ['raw_meat'],
    weaponDropModifier: 0, // Never drop weapons
    goldModifier: 0.3, // Beasts have little gold (swallowed coins)
  },

  // Elementals drop magical materials
  elemental: {
    weaponCategories: [], // No weapons
    materials: ['essence', 'crystal'],
    consumables: ['spirit_potion_small'],
    weaponDropModifier: 0, // Never drop weapons
    goldModifier: 0.5,
  },

  // Aberrations drop strange body parts
  aberration: {
    weaponCategories: [], // No weapons (but can drop magic items)
    materials: ['strange_flesh', 'eye'],
    consumables: [],
    weaponDropModifier: 0,
    goldModifier: 1.5, // Often found in treasure rooms
  },

  // Demons carry infernal weapons
  demon: {
    weaponCategories: ['STR', 'INT', 'CHA'], // Swords, staves, scepters
    materials: ['demon_essence', 'horn'],
    consumables: [],
    weaponDropModifier: 1.2, // Good weapon drops
    goldModifier: 1.0,
  },

  // Giants use crude but powerful weapons
  giant: {
    weaponCategories: ['STR', 'END'], // Clubs, hammers, shields
    materials: ['giant_bone', 'hide'],
    consumables: ['cooked_meat'],
    weaponDropModifier: 0.8, // Weapons often too big
    goldModifier: 2.0, // Giants hoard treasure
  },

  // Dragons don't use weapons but drop valuable materials
  dragon: {
    weaponCategories: [], // Dragons don't wield weapons
    materials: ['scale', 'horn', 'fang'],
    consumables: [],
    weaponDropModifier: 0,
    goldModifier: 3.0, // Dragons hoard massive treasure
  },
};

/**
 * Check if a monster category can drop weapons
 */
export function canDropWeapon(category: MonsterCategory): boolean {
  const pool = MONSTER_LOOT_POOLS[category];
  return pool.weaponCategories.length > 0 && pool.weaponDropModifier > 0;
}

/**
 * Get valid weapon categories for a monster
 */
export function getWeaponCategoriesForMonster(category: MonsterCategory): WeaponCategory[] {
  return MONSTER_LOOT_POOLS[category].weaponCategories;
}

/**
 * Get possible materials for a monster
 */
export function getMaterialsForMonster(category: MonsterCategory): MaterialType[] {
  return MONSTER_LOOT_POOLS[category].materials;
}

/**
 * Get gold modifier for a monster category
 */
export function getGoldModifier(category: MonsterCategory): number {
  return MONSTER_LOOT_POOLS[category].goldModifier;
}

/**
 * Get weapon drop chance modifier for a monster category
 */
export function getWeaponDropModifier(category: MonsterCategory): number {
  return MONSTER_LOOT_POOLS[category].weaponDropModifier;
}

/**
 * Roll for a random material drop from a monster
 */
export function rollMaterialDrop(category: MonsterCategory): MaterialType | null {
  const pool = MONSTER_LOOT_POOLS[category];
  if (pool.materials.length === 0) return null;

  // 40% chance to drop a material
  if (Math.random() > 0.4) return null;

  return pool.materials[Math.floor(Math.random() * pool.materials.length)];
}
