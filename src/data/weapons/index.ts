/**
 * Weapon data exports
 */

export * from './baseWeapons';
export * from './strWeapons';
export * from './agiWeapons';
export * from './perWeapons';
export * from './intWeapons';
export * from './wisWeapons';
export * from './chaWeapons';
export * from './endWeapons';
export * from './lckWeapons';
export * from './hybridWeapons';

import { STR_WEAPONS } from './strWeapons';
import { AGI_WEAPONS } from './agiWeapons';
import { PER_WEAPONS } from './perWeapons';
import { INT_WEAPONS } from './intWeapons';
import { WIS_WEAPONS } from './wisWeapons';
import { CHA_WEAPONS } from './chaWeapons';
import { END_WEAPONS } from './endWeapons';
import { LCK_WEAPONS } from './lckWeapons';
import { ALL_HYBRID_WEAPONS } from './hybridWeapons';
import { ALL_BASE_WEAPONS } from './baseWeapons';
import type { BaseWeapon, WeaponCategory } from '../../types/Weapon';

export const ALL_WEAPONS: BaseWeapon[] = [
  ...ALL_BASE_WEAPONS,
  ...STR_WEAPONS,
  ...AGI_WEAPONS,
  ...PER_WEAPONS,
  ...INT_WEAPONS,
  ...WIS_WEAPONS,
  ...CHA_WEAPONS,
  ...END_WEAPONS,
  ...LCK_WEAPONS,
  ...ALL_HYBRID_WEAPONS,
];

/**
 * Get all weapons available for a given character level and optional category filter
 */
export function getWeaponsByLevel(
  characterLevel: number,
  categoryFilter?: WeaponCategory[]
): BaseWeapon[] {
  return ALL_WEAPONS.filter(w => {
    const levelOk = (w.minLevel ?? 1) <= characterLevel;
    if (!levelOk) return false;
    if (!categoryFilter || categoryFilter.length === 0) return true;
    if (w.primaryStats) {
      return w.primaryStats.some(s => categoryFilter.includes(s));
    }
    return categoryFilter.includes(w.category as WeaponCategory);
  });
}

/**
 * Get unique weapons (level 9-10) available at this character level
 */
export function getUniqueWeaponsByLevel(characterLevel: number): BaseWeapon[] {
  return ALL_WEAPONS.filter(w => w.isUnique && (w.minLevel ?? 1) <= characterLevel);
}

/**
 * Generate a leveled weapon drop from the full expanded pool (avoids circular dep with baseWeapons.ts).
 * Use this instead of generateRandomWeapon when character level gating is needed.
 */
export function generateLeveledWeaponDrop(
  floorNumber: number,
  characterLevel: number,
  categoryFilter?: WeaponCategory[]
): import('../../types/Weapon').Weapon {
  const { MATERIALS, QUALITIES, ENCHANTMENTS, createWeaponInstance } = require('./baseWeapons');

  const pool = getWeaponsByLevel(characterLevel, categoryFilter);
  const safePool = pool.length > 0 ? pool : ALL_WEAPONS.filter(w => !w.isUnique);
  const baseWeapon = safePool[Math.floor(Math.random() * safePool.length)];

  const availableMaterials = MATERIALS.filter((m: { minFloor: number }) => m.minFloor <= floorNumber);
  const material = availableMaterials[Math.floor(Math.random() * availableMaterials.length)];

  const availableQualities = QUALITIES.filter((q: { minFloor: number }) => q.minFloor <= floorNumber);
  const quality = availableQualities[Math.floor(Math.random() * availableQualities.length)];

  let enchantment: import('../../types/Weapon').WeaponEnchantment | undefined;
  if (Math.random() < 0.2) {
    const availableEnchants = ENCHANTMENTS.filter((e: { minFloor: number }) => e.minFloor <= floorNumber);
    if (availableEnchants.length > 0) {
      enchantment = availableEnchants[Math.floor(Math.random() * availableEnchants.length)];
    }
  }

  return createWeaponInstance(baseWeapon, material, quality, enchantment, floorNumber);
}
