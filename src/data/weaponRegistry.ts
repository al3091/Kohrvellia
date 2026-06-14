/**
 * Weapon Registry
 * Stores generated weapon instances by ID for later lookup
 * Used by inventory, shop, and blacksmith systems
 */

import type { Weapon } from '../types/Weapon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'kohrvellia-weapon-registry';

// In-memory cache of weapons
const weaponCache: Map<string, Weapon> = new Map();

// Flag to track if we've loaded from storage
let isLoaded = false;

/**
 * Register a weapon in the registry
 */
export function registerWeapon(weapon: Weapon): void {
  weaponCache.set(weapon.id, weapon);
  // Persist asynchronously (fire and forget)
  saveToStorage();
}

/**
 * Get a weapon by ID
 */
export function getWeaponById(weaponId: string): Weapon | undefined {
  return weaponCache.get(weaponId);
}

/**
 * Update a weapon in the registry (e.g., after identification or upgrade)
 */
export function updateWeapon(weapon: Weapon): void {
  weaponCache.set(weapon.id, weapon);
  saveToStorage();
}

/**
 * Remove a weapon from the registry (e.g., when sold or destroyed)
 */
export function unregisterWeapon(weaponId: string): void {
  weaponCache.delete(weaponId);
  saveToStorage();
}

/**
 * Check if a weapon exists in the registry
 */
export function hasWeapon(weaponId: string): boolean {
  return weaponCache.has(weaponId);
}

/**
 * Get all registered weapons
 */
export function getAllWeapons(): Weapon[] {
  return Array.from(weaponCache.values());
}

/**
 * Clear the entire registry (for testing or new game)
 */
export function clearWeaponRegistry(): void {
  weaponCache.clear();
  saveToStorage();
}

/**
 * B-07 (KV-AUD-118): repopulate the registry from a known set of weapons (e.g. the character's
 * inventory/equipment) so a desynced or wiped registry self-heals instead of returning undefined.
 */
export function rebuildWeaponRegistry(weapons: Weapon[]): void {
  weapons.forEach((w) => {
    if (w && w.id) weaponCache.set(w.id, w);
  });
  isLoaded = true;
  saveToStorage();
}

/**
 * Load weapons from AsyncStorage
 */
export async function loadWeaponRegistry(): Promise<void> {
  if (isLoaded) return;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const weapons: unknown = JSON.parse(stored);
      if (Array.isArray(weapons)) {
        weapons.forEach((w) => {
          if (w && typeof w === 'object' && typeof (w as Weapon).id === 'string') {
            weaponCache.set((w as Weapon).id, w as Weapon);
          }
        });
      }
    }
    isLoaded = true;
  } catch (error) {
    // B-07 (KV-AUD-118): a corrupt registry must self-heal, not wedge the session — discard the bad
    // blob and continue with an empty cache (it refills as weapons are registered).
    console.error('Weapon registry corrupt — discarding and rebuilding:', error);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // best effort
    }
    weaponCache.clear();
    isLoaded = true;
  }
}

/**
 * Save weapons to AsyncStorage
 */
async function saveToStorage(): Promise<void> {
  try {
    const weapons = Array.from(weaponCache.values());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(weapons));
  } catch (error) {
    console.error('Failed to save weapon registry:', error);
  }
}

/**
 * Initialize the weapon registry (call on app start)
 */
export async function initWeaponRegistry(): Promise<void> {
  await loadWeaponRegistry();
}
