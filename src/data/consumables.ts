/**
 * Consumable item definitions for Kohrvellia
 * Includes potions, cures, buffs, and utility items
 */

import type { Consumable } from '../types/Consumable';
import { registerConsumable } from '../stores/useInventoryStore';

// ===== HEALING POTIONS =====

export const HEALTH_POTION_SMALL: Consumable = {
  id: 'health_potion_small',
  name: 'Health Potion (Small)',
  description: 'A small vial of red liquid that restores health.',
  rarity: 'common',
  effect: {
    type: 'heal_hp',
    value: 30,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 25,
  sellPrice: 10,
  minFloor: 1,
  dropWeight: 100,
  icon: '🧪',
  color: '#EF4444',
};

export const HEALTH_POTION_MEDIUM: Consumable = {
  id: 'health_potion_medium',
  name: 'Health Potion',
  description: 'A vial of concentrated healing liquid.',
  rarity: 'uncommon',
  effect: {
    type: 'heal_hp',
    value: 75,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 75,
  sellPrice: 30,
  minFloor: 6,
  dropWeight: 60,
  icon: '🧪',
  color: '#EF4444',
};

export const HEALTH_POTION_LARGE: Consumable = {
  id: 'health_potion_large',
  name: 'Health Potion (Large)',
  description: 'A large flask of potent healing elixir.',
  rarity: 'rare',
  effect: {
    type: 'heal_hp',
    value: 150,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 200,
  sellPrice: 80,
  minFloor: 15,
  dropWeight: 30,
  icon: '🧪',
  color: '#EF4444',
};

export const HEALTH_POTION_FULL: Consumable = {
  id: 'health_potion_full',
  name: 'Elixir of Restoration',
  description: 'A legendary elixir that fully restores health.',
  rarity: 'epic',
  effect: {
    type: 'heal_percent_hp',
    value: 100,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 500,
  sellPrice: 200,
  minFloor: 30,
  dropWeight: 10,
  icon: '✨',
  color: '#8B5CF6',
};

// ===== SP POTIONS =====

export const SPIRIT_POTION_SMALL: Consumable = {
  id: 'spirit_potion_small',
  name: 'Spirit Potion (Small)',
  description: 'A small vial of blue liquid that restores spirit energy.',
  rarity: 'common',
  effect: {
    type: 'heal_sp',
    value: 20,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 30,
  sellPrice: 12,
  minFloor: 1,
  dropWeight: 80,
  icon: '🧪',
  color: '#3B82F6',
};

export const SPIRIT_POTION_MEDIUM: Consumable = {
  id: 'spirit_potion_medium',
  name: 'Spirit Potion',
  description: 'A vial of concentrated spirit essence.',
  rarity: 'uncommon',
  effect: {
    type: 'heal_sp',
    value: 50,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 90,
  sellPrice: 36,
  minFloor: 6,
  dropWeight: 50,
  icon: '🧪',
  color: '#3B82F6',
};

export const SPIRIT_POTION_LARGE: Consumable = {
  id: 'spirit_potion_large',
  name: 'Spirit Potion (Large)',
  description: 'A large flask of pure spirit energy.',
  rarity: 'rare',
  effect: {
    type: 'heal_sp',
    value: 100,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 250,
  sellPrice: 100,
  minFloor: 15,
  dropWeight: 25,
  icon: '🧪',
  color: '#3B82F6',
};

// ===== STATUS CURES =====

export const ANTIDOTE: Consumable = {
  id: 'antidote',
  name: 'Antidote',
  description: 'A bitter medicine that neutralizes poison.',
  rarity: 'common',
  effect: {
    type: 'cure_poison',
    value: 0,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 50,
  sellPrice: 20,
  minFloor: 1,
  dropWeight: 60,
  icon: '💊',
  color: '#10B981',
};

export const BANDAGE: Consumable = {
  id: 'bandage',
  name: 'Bandage',
  description: 'Clean cloth to stop bleeding wounds.',
  rarity: 'common',
  effect: {
    type: 'cure_bleed',
    value: 0,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 40,
  sellPrice: 15,
  minFloor: 1,
  dropWeight: 70,
  icon: '🩹',
  color: '#F9FAFB',
};

export const PANACEA: Consumable = {
  id: 'panacea',
  name: 'Panacea',
  description: 'A universal remedy that cures all ailments.',
  rarity: 'rare',
  effect: {
    type: 'cure_all',
    value: 0,
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 300,
  sellPrice: 120,
  minFloor: 20,
  dropWeight: 15,
  icon: '💎',
  color: '#F0ABFC',
};

// ===== UTILITY ITEMS =====

export const SMOKE_BOMB: Consumable = {
  id: 'smoke_bomb',
  name: 'Smoke Bomb',
  description: 'Creates a cloud of smoke for guaranteed escape.',
  rarity: 'uncommon',
  effect: {
    type: 'flee',
    value: 100, // 100% success rate
  },
  usableInCombat: true,
  usableOutOfCombat: false,
  buyPrice: 100,
  sellPrice: 40,
  minFloor: 5,
  dropWeight: 40,
  icon: '💨',
  color: '#6B7280',
};

export const BOMB: Consumable = {
  id: 'bomb',
  name: 'Bomb',
  description: 'An explosive device that deals damage to all enemies.',
  rarity: 'uncommon',
  effect: {
    type: 'damage',
    value: 50,
  },
  usableInCombat: true,
  usableOutOfCombat: false,
  buyPrice: 120,
  sellPrice: 48,
  minFloor: 8,
  dropWeight: 35,
  icon: '💣',
  color: '#1F2937',
};

export const FIRE_BOMB: Consumable = {
  id: 'fire_bomb',
  name: 'Fire Bomb',
  description: 'An incendiary device that deals fire damage.',
  rarity: 'rare',
  effect: {
    type: 'damage',
    value: 100,
  },
  usableInCombat: true,
  usableOutOfCombat: false,
  buyPrice: 250,
  sellPrice: 100,
  minFloor: 15,
  dropWeight: 20,
  icon: '🔥',
  color: '#F97316',
};

// ===== BUFF ITEMS =====

export const STRENGTH_TONIC: Consumable = {
  id: 'strength_tonic',
  name: 'Strength Tonic',
  description: 'Temporarily increases physical power.',
  rarity: 'uncommon',
  effect: {
    type: 'buff',
    value: 10,
    duration: 5,
    buffEffect: {
      name: 'Strength Up',
      stat: 'STR',
      value: 10,
    },
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 80,
  sellPrice: 32,
  minFloor: 5,
  dropWeight: 30,
  icon: '💪',
  color: '#DC2626',
};

export const AGILITY_ELIXIR: Consumable = {
  id: 'agility_elixir',
  name: 'Agility Elixir',
  description: 'Temporarily increases speed and evasion.',
  rarity: 'uncommon',
  effect: {
    type: 'buff',
    value: 10,
    duration: 5,
    buffEffect: {
      name: 'Agility Up',
      stat: 'AGI',
      value: 10,
    },
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 80,
  sellPrice: 32,
  minFloor: 5,
  dropWeight: 30,
  icon: '⚡',
  color: '#FACC15',
};

export const IRON_SKIN_POTION: Consumable = {
  id: 'iron_skin_potion',
  name: 'Iron Skin Potion',
  description: 'Temporarily hardens skin to reduce damage.',
  rarity: 'uncommon',
  effect: {
    type: 'buff',
    value: 10,
    duration: 5,
    buffEffect: {
      name: 'Endurance Up',
      stat: 'END',
      value: 10,
    },
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  buyPrice: 80,
  sellPrice: 32,
  minFloor: 5,
  dropWeight: 30,
  icon: '🛡️',
  color: '#64748B',
};

// ===== FOOD ITEMS =====

export const BREAD: Consumable = {
  id: 'bread',
  name: 'Bread',
  description: 'Simple but filling. Restores a small amount of HP.',
  rarity: 'common',
  effect: {
    type: 'heal_hp',
    value: 15,
  },
  usableInCombat: false,
  usableOutOfCombat: true,
  buyPrice: 10,
  sellPrice: 4,
  minFloor: 1,
  dropWeight: 120,
  satiationRestore: 15,
  icon: '🍞',
  color: '#D97706',
};

export const RATION: Consumable = {
  id: 'ration',
  name: 'Travel Ration',
  description: 'A package of preserved food for adventurers.',
  rarity: 'common',
  effect: {
    type: 'heal_hp',
    value: 25,
  },
  usableInCombat: false,
  usableOutOfCombat: true,
  buyPrice: 20,
  sellPrice: 8,
  minFloor: 1,
  dropWeight: 100,
  satiationRestore: 30,
  icon: '🥪',
  color: '#92400E',
};

export const COOKED_MEAT: Consumable = {
  id: 'cooked_meat',
  name: 'Cooked Meat',
  description: 'Well-prepared meat that restores health.',
  rarity: 'uncommon',
  effect: {
    type: 'heal_hp',
    value: 50,
  },
  usableInCombat: false,
  usableOutOfCombat: true,
  buyPrice: 45,
  sellPrice: 18,
  minFloor: 5,
  dropWeight: 50,
  satiationRestore: 25,
  icon: '🍖',
  color: '#991B1B',
};

// ===== ALL CONSUMABLES =====

export const ALL_CONSUMABLES: Consumable[] = [
  // Healing
  HEALTH_POTION_SMALL,
  HEALTH_POTION_MEDIUM,
  HEALTH_POTION_LARGE,
  HEALTH_POTION_FULL,
  // SP
  SPIRIT_POTION_SMALL,
  SPIRIT_POTION_MEDIUM,
  SPIRIT_POTION_LARGE,
  // Status cures
  ANTIDOTE,
  BANDAGE,
  PANACEA,
  // Utility
  SMOKE_BOMB,
  BOMB,
  FIRE_BOMB,
  // Buffs
  STRENGTH_TONIC,
  AGILITY_ELIXIR,
  IRON_SKIN_POTION,
  // Food
  BREAD,
  RATION,
  COOKED_MEAT,
];

// ===== INITIALIZATION =====

/**
 * Register all consumables with the inventory store
 * Call this once at app startup
 */
export function initializeConsumables(): void {
  for (const consumable of ALL_CONSUMABLES) {
    registerConsumable(consumable);
  }
}

/**
 * Get consumables available at a given floor
 */
export function getAvailableConsumables(floor: number): Consumable[] {
  return ALL_CONSUMABLES.filter((c) => floor >= c.minFloor);
}

/**
 * Get a random consumable drop for a given floor
 */
export function getRandomConsumableDrop(
  floor: number,
  luckBonus: number = 0
): Consumable | null {
  const available = getAvailableConsumables(floor);
  if (available.length === 0) return null;

  // Calculate total weight
  const totalWeight = available.reduce((sum, c) => sum + c.dropWeight, 0);

  // Random weighted selection
  let roll = Math.random() * totalWeight;

  for (const consumable of available) {
    roll -= consumable.dropWeight;
    if (roll <= 0) {
      // Luck can upgrade rarity
      if (luckBonus > 0 && Math.random() < luckBonus / 100) {
        // Try to find a higher rarity version
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const currentIndex = rarityOrder.indexOf(consumable.rarity);
        if (currentIndex < rarityOrder.length - 1) {
          const betterRarity = rarityOrder[currentIndex + 1];
          const better = available.find(
            (c) => c.rarity === betterRarity && c.effect.type === consumable.effect.type
          );
          if (better) return better;
        }
      }
      return consumable;
    }
  }

  return available[0];
}

/**
 * Get consumable by ID
 */
export function getConsumableById(id: string): Consumable | undefined {
  return ALL_CONSUMABLES.find((c) => c.id === id);
}
