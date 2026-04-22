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
 * Load weapons from AsyncStorage
 */
export async function loadWeaponRegistry(): Promise<void> {
  if (isLoaded) return;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const weapons: Weapon[] = JSON.parse(stored);
      weapons.forEach((w) => weaponCache.set(w.id, w));
    }
    isLoaded = true;
  } catch (error) {
    console.error('Failed to load weapon registry:', error);
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
