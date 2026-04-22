/**
 * Inventory state store using Zustand
 * Provides specialized inventory management, consumable handling, and gold operations
 * Works alongside useCharacterStore which handles persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { InventoryItem } from '../types/Character';
import type { Consumable, ConsumableEffect } from '../types/Consumable';
import { useCharacterStore } from './useCharacterStore';

// Max inventory slots before overflow
const MAX_INVENTORY_SLOTS = 50;

// Consumable data registry (populated by data files)
const consumableRegistry: Map<string, Consumable> = new Map();

export function registerConsumable(consumable: Consumable): void {
  consumableRegistry.set(consumable.id, consumable);
}

export function getConsumableData(consumableId: string): Consumable | undefined {
  return consumableRegistry.get(consumableId);
}

interface InventoryState {
  // Transient state (not persisted - just for UI)
  selectedItemId: string | null;

  // Actions - Item selection
  selectItem: (itemId: string | null) => void;

  // Actions - Consumables
  useConsumable: (consumableId: string) => ConsumableEffect | null;
  getConsumables: () => InventoryItem[];

  // Actions - Convenience wrappers
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  getGold: () => number;
  addItem: (item: InventoryItem) => boolean;
  removeItem: (itemId: string, quantity?: number) => void;
  hasItem: (itemId: string) => boolean;
  getItemCount: (itemId: string) => number;
  getTotalItemCount: () => number;
  canAddItem: () => boolean;

  // Actions - Materials
  getMaterials: () => InventoryItem[];
  hasMaterials: (requirements: Array<{ id: string; quantity: number }>) => boolean;
  consumeMaterials: (requirements: Array<{ id: string; quantity: number }>) => boolean;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      selectedItemId: null,

      // Item selection
      selectItem: (itemId) => {
        set({ selectedItemId: itemId });
      },

      // Consumables
      useConsumable: (consumableId) => {
        const characterStore = useCharacterStore.getState();
        const character = characterStore.character;
        if (!character) return null;

        // Find the consumable in inventory
        const item = character.inventory.find(
          (i) => i.id === consumableId && i.type === 'consumable'
        );
        if (!item || item.quantity <= 0) return null;

        // Get consumable data
        const consumableData = getConsumableData(consumableId);
        if (!consumableData) {
          // Fallback for unregistered consumables
          characterStore.removeFromInventory(consumableId, 1);
          return { type: 'unknown', value: 0 } as unknown as ConsumableEffect;
        }

        // Apply effects
        const effect = consumableData.effect;

        switch (effect.type) {
          case 'heal_hp':
            characterStore.modifyHP(effect.value);
            break;
          case 'heal_sp':
            characterStore.modifySP(effect.value);
            break;
          case 'heal_percent_hp':
            const maxHP = characterStore.getDerivedStats().maxHP;
            characterStore.modifyHP(Math.floor(maxHP * (effect.value / 100)));
            break;
          case 'heal_percent_sp':
            const maxSP = characterStore.getDerivedStats().maxSP;
            characterStore.modifySP(Math.floor(maxSP * (effect.value / 100)));
            break;
          case 'cure_poison':
          case 'cure_bleed':
          case 'cure_all':
            const effectType = effect.type;
            if (effectType === 'cure_all') {
              // Remove all negative status effects
              character.statusEffects.forEach((e) => characterStore.removeStatusEffect(e.id));
            } else {
              // Remove specific effect
              const statusId = effectType === 'cure_poison' ? 'poison' : 'bleed';
              characterStore.removeStatusEffect(statusId);
            }
            break;
          case 'buff':
            if (effect.buffEffect) {
              characterStore.addStatusEffect({
                id: `consumable_buff_${Date.now()}`,
                name: effect.buffEffect.name || 'Consumable Buff',
                type: 'buff',
                duration: effect.duration || 3,
                stat: effect.buffEffect.stat,
                value: effect.buffEffect.value,
              } as unknown as Parameters<typeof characterStore.addStatusEffect>[0]);
            }
            break;
        }

        // Remove from inventory
        characterStore.removeFromInventory(consumableId, 1);

        return effect;
      },

      getConsumables: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return [];
        return character.inventory.filter((i) => i.type === 'consumable');
      },

      // Gold convenience wrappers
      addGold: (amount) => {
        useCharacterStore.getState().modifyGold(amount);
      },

      spendGold: (amount) => {
        const character = useCharacterStore.getState().character;
        if (!character || character.gold < amount) return false;
        useCharacterStore.getState().modifyGold(-amount);
        return true;
      },

      getGold: () => {
        const character = useCharacterStore.getState().character;
        return character?.gold ?? 0;
      },

      // Item convenience wrappers
      addItem: (item) => {
        const character = useCharacterStore.getState().character;
        if (!character) return false;

        // Check capacity (unless stackable and already exists)
        if (item.stackable) {
          const existing = character.inventory.find((i) => i.id === item.id);
          if (existing) {
            useCharacterStore.getState().addToInventory(item);
            return true;
          }
        }

        // Check slots
        if (character.inventory.length >= MAX_INVENTORY_SLOTS) {
          return false;
        }

        useCharacterStore.getState().addToInventory(item);
        return true;
      },

      removeItem: (itemId, quantity = 1) => {
        useCharacterStore.getState().removeFromInventory(itemId, quantity);
      },

      hasItem: (itemId) => {
        const character = useCharacterStore.getState().character;
        if (!character) return false;
        return character.inventory.some((i) => i.id === itemId && i.quantity > 0);
      },

      getItemCount: (itemId) => {
        const character = useCharacterStore.getState().character;
        if (!character) return 0;
        const item = character.inventory.find((i) => i.id === itemId);
        return item?.quantity ?? 0;
      },

      getTotalItemCount: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return 0;
        return character.inventory.length;
      },

      canAddItem: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return false;
        return character.inventory.length < MAX_INVENTORY_SLOTS;
      },

      // Materials
      getMaterials: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return [];
        return character.inventory.filter((i) => i.type === 'material');
      },

      hasMaterials: (requirements) => {
        for (const req of requirements) {
          if (get().getItemCount(req.id) < req.quantity) {
            return false;
          }
        }
        return true;
      },

      consumeMaterials: (requirements) => {
        if (!get().hasMaterials(requirements)) return false;

        for (const req of requirements) {
          get().removeItem(req.id, req.quantity);
        }
        return true;
      },
    }),
    {
      name: 'kohrvellia-inventory-ui',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist UI state, not actual inventory (that's in character store)
      partialize: (state) => ({
        selectedItemId: state.selectedItemId,
      }),
    }
  )
);
