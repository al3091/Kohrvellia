/**
 * Shop state store using Zustand
 * Manages shop inventory, purchases, and sales
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Consumable as _Consumable } from '../types/Consumable';
import type { Weapon } from '../types/Weapon';
import type { Armor } from '../types/Armor';
import type { InventoryItem } from '../types/Character';
import type {
  ShopState,
  ConsumableStock,
  EquipmentStock,
  PurchaseResult,
  SellResult,
} from '../types/Shop';
import {
  calculateWeaponPrice,
  calculateArmorPrice,
  calculateSellPrice,
  applyReputationDiscount,
} from '../types/Shop';
import { getAvailableConsumables, getConsumableById } from '../data/consumables';
import { useInventoryStore } from './useInventoryStore';
import { useGameStore } from './useGameStore';
import { useCharacterStore } from './useCharacterStore';
import { generateRandomWeapon } from '../data/weapons/baseWeapons';
import { registerWeapon } from '../data/weaponRegistry';
import { generateRandomArmor } from '../data/armor/baseArmors';

// NPC reputation storage (simple version - can be expanded later)
interface NPCReputation {
  general: number;    // General store NPC
  equipment: number;  // Equipment vendor NPC
  blacksmith: number; // Blacksmith NPC
}

interface ShopStoreState extends ShopState {
  // NPC Reputation
  npcReputation: NPCReputation;

  // Session purchase counts (not persisted — resets on app reload / stock refresh)
  sessionPurchaseCounts: Record<string, number>;

  // Actions - Stock Management
  refreshStock: () => void;
  shouldRefreshStock: () => boolean;
  resetSessionCounts: () => void;

  // Actions - Purchasing
  purchaseConsumable: (consumableId: string, quantity: number) => PurchaseResult;
  purchaseEquipment: (index: number) => PurchaseResult;

  // Actions - Selling
  sellItem: (itemId: string, quantity: number) => SellResult;

  // Actions - Pricing
  getConsumablePrice: (consumableId: string, quantity: number) => number;
  getEquipmentPrice: (index: number) => number;

  // Actions - Reputation
  getReputation: (shopType: 'general' | 'equipment' | 'blacksmith') => number;
  addReputation: (shopType: 'general' | 'equipment' | 'blacksmith', amount: number) => void;
  resetReputation: () => void;

  // Actions - Utilities
  getAvailableStock: () => ConsumableStock[];
  getEquipmentForSale: () => EquipmentStock[];
}

const DEFAULT_NPC_REPUTATION: NPCReputation = {
  general: 1,
  equipment: 1,
  blacksmith: 1,
};

export const useShopStore = create<ShopStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      generalStock: [],
      equipmentStock: [],
      lastRefresh: 0,
      deepestFloorAtRefresh: 0,
      totalRunsAtRefresh: 0,
      npcReputation: DEFAULT_NPC_REPUTATION,
      sessionPurchaseCounts: {},

      // Check if stock should be refreshed
      shouldRefreshStock: () => {
        const state = get();
        const gameStore = useGameStore.getState();
        const currentBestFloor = gameStore.bestFloorReached;
        const currentTotalRuns = gameStore.totalRuns;

        // Refresh if never generated
        if (state.lastRefresh === 0) return true;
        if (state.generalStock.length === 0) return true;
        // Refresh when player reaches a new deepest floor
        if (currentBestFloor > state.deepestFloorAtRefresh) return true;
        // Refresh on every completed dungeon run — shop wares change between expeditions
        if (currentTotalRuns > state.totalRunsAtRefresh) return true;

        return false;
      },

      // Refresh shop inventory
      refreshStock: () => {
        const gameStore = useGameStore.getState();
        const currentBestFloor = Math.max(1, gameStore.bestFloorReached);

        // Generate consumable stock
        const availableConsumables = getAvailableConsumables(currentBestFloor);
        const consumableStock: ConsumableStock[] = availableConsumables.map((c) => ({
          consumableId: c.id,
          quantity: -1, // Unlimited for now
          basePrice: c.buyPrice,
        }));

        // Generate equipment stock (6 + floor/5 items), ~60% weapons / 40% armor
        const numEquipment = 6 + Math.floor(currentBestFloor / 5);
        const equipmentStock: EquipmentStock[] = [];

        // Guarantee one weapon per stat category and one armor per slot on early floors
        if (currentBestFloor <= 3) {
          const statCategories = ['STR', 'AGI', 'PER', 'INT', 'WIS', 'CHA', 'END', 'LCK'] as const;
          for (const stat of statCategories) {
            const weapon = generateRandomWeapon(currentBestFloor, [stat]);
            registerWeapon(weapon);
            equipmentStock.push({ item: weapon, basePrice: calculateWeaponPrice(weapon), sold: false });
          }
          const armorSlots = ['head', 'chest', 'hands', 'legs'] as const;
          for (const _slot of armorSlots) {
            const armor = generateRandomArmor(currentBestFloor);
            equipmentStock.push({ item: armor, basePrice: calculateArmorPrice(armor), sold: false });
          }
        }

        for (let i = 0; i < numEquipment; i++) {
          const variance = Math.floor(Math.random() * 5) - 2;
          const effectiveFloor = Math.max(1, currentBestFloor + variance);

          if (Math.random() < 0.4) {
            // Armor piece
            const armor = generateRandomArmor(effectiveFloor);
            equipmentStock.push({
              item: armor,
              basePrice: calculateArmorPrice(armor),
              sold: false,
            });
          } else {
            // Weapon
            const weapon = generateRandomWeapon(effectiveFloor);
            registerWeapon(weapon);
            equipmentStock.push({
              item: weapon,
              basePrice: calculateWeaponPrice(weapon),
              sold: false,
            });
          }
        }

        const currentTotalRuns = useGameStore.getState().totalRuns;
        set({
          generalStock: consumableStock,
          equipmentStock,
          lastRefresh: Date.now(),
          deepestFloorAtRefresh: currentBestFloor,
          totalRunsAtRefresh: currentTotalRuns,
          sessionPurchaseCounts: {}, // Reset surcharge on stock refresh
        });
      },

      // Reset session surcharges (call on dungeon return to town)
      resetSessionCounts: () => {
        set({ sessionPurchaseCounts: {} });
      },

      // Purchase a consumable
      purchaseConsumable: (consumableId, quantity) => {
        const state = get();
        const inventoryStore = useInventoryStore.getState();

        // Find the consumable in stock
        const stockItem = state.generalStock.find((s) => s.consumableId === consumableId);
        if (!stockItem) {
          return { success: false, reason: 'Item not in stock' };
        }

        // Check quantity
        if (stockItem.quantity !== -1 && stockItem.quantity < quantity) {
          return { success: false, reason: 'Not enough in stock' };
        }

        // Calculate price with reputation discount and session surcharge
        // Each successive purchase of the same consumable costs +25% more this session
        const purchaseCount = state.sessionPurchaseCounts[consumableId] ?? 0;
        const surchargeFactor = Math.pow(1.25, purchaseCount);
        const reputation = state.npcReputation.general;
        const totalPrice = applyReputationDiscount(
          Math.ceil(stockItem.basePrice * quantity * surchargeFactor),
          reputation
        );

        // Check gold
        const currentGold = inventoryStore.getGold();
        if (currentGold < totalPrice) {
          return { success: false, reason: 'Not enough gold' };
        }

        // Check inventory space
        if (!inventoryStore.canAddItem()) {
          return { success: false, reason: 'Inventory full' };
        }

        // Process purchase
        inventoryStore.spendGold(totalPrice);

        // Add items to inventory
        const consumableData = getConsumableById(consumableId);
        if (consumableData) {
          const inventoryItem: InventoryItem = {
            id: consumableId,
            type: 'consumable',
            stackable: true,
            quantity: quantity,
            identified: true,
          };
          inventoryStore.addItem(inventoryItem);
        }

        // Increment session purchase count (surcharge tracking)
        set((s) => ({
          sessionPurchaseCounts: {
            ...s.sessionPurchaseCounts,
            [consumableId]: (s.sessionPurchaseCounts[consumableId] ?? 0) + 1,
          },
        }));

        // Update stock quantity if limited
        if (stockItem.quantity !== -1) {
          set({
            generalStock: state.generalStock.map((s) =>
              s.consumableId === consumableId
                ? { ...s, quantity: s.quantity - quantity }
                : s
            ),
          });
        }

        // Reputation gain for purchases over 100g
        if (totalPrice >= 100) {
          get().addReputation('general', 1);
        }

        return {
          success: true,
          goldSpent: totalPrice,
          itemId: consumableId,
        };
      },

      // Purchase equipment
      purchaseEquipment: (index) => {
        const state = get();
        const inventoryStore = useInventoryStore.getState();

        // Get equipment at index
        const stockItem = state.equipmentStock[index];
        if (!stockItem || stockItem.sold) {
          return { success: false, reason: 'Item not available' };
        }

        // Calculate price with reputation discount
        const reputation = state.npcReputation.equipment;
        const finalPrice = applyReputationDiscount(stockItem.basePrice, reputation);

        // Check gold
        const currentGold = inventoryStore.getGold();
        if (currentGold < finalPrice) {
          return { success: false, reason: 'Not enough gold' };
        }

        // Check inventory space
        if (!inventoryStore.canAddItem()) {
          return { success: false, reason: 'Inventory full' };
        }

        // Process purchase
        inventoryStore.spendGold(finalPrice);

        // Add weapon or armor to inventory
        const isArmor = 'finalDefense' in stockItem.item;
        let inventoryItem: InventoryItem;

        if (isArmor) {
          const armor = stockItem.item as Armor;
          inventoryItem = {
            id: armor.id,
            type: 'armor',
            stackable: false,
            quantity: 1,
            identified: true,
            armorData: armor,
          };
        } else {
          const weapon = stockItem.item as Weapon;
          registerWeapon(weapon);
          inventoryItem = {
            id: weapon.id,
            type: 'weapon',
            stackable: false,
            quantity: 1,
            identified: true,
            weaponData: weapon,
          };
        }
        inventoryStore.addItem(inventoryItem);

        // Mark as sold
        set({
          equipmentStock: state.equipmentStock.map((s, i) =>
            i === index ? { ...s, sold: true } : s
          ),
        });

        // Reputation gain for purchases over 100g
        if (finalPrice >= 100) {
          get().addReputation('equipment', 1);
        }

        return {
          success: true,
          goldSpent: finalPrice,
          itemId: inventoryItem.id,
        };
      },

      // Sell an item
      sellItem: (itemId, quantity) => {
        const inventoryStore = useInventoryStore.getState();

        // Check if player has the item
        if (!inventoryStore.hasItem(itemId)) {
          return { success: false, reason: 'Item not found in inventory' };
        }

        const itemCount = inventoryStore.getItemCount(itemId);
        if (itemCount < quantity) {
          return { success: false, reason: 'Not enough items' };
        }

        // Calculate sell price
        let sellPrice = 0;

        const consumableData = getConsumableById(itemId);
        if (consumableData) {
          sellPrice = consumableData.sellPrice * quantity;
        } else {
          // Look up full item data from character inventory for accurate pricing
          const character = useCharacterStore.getState().character;
          const invItem = character?.inventory.find((i) => i.id === itemId);
          if (invItem?.weaponData) {
            sellPrice = calculateSellPrice(calculateWeaponPrice(invItem.weaponData)) * quantity;
          } else if (invItem?.armorData) {
            sellPrice = calculateSellPrice(calculateArmorPrice(invItem.armorData)) * quantity;
          } else {
            sellPrice = Math.floor(20 * quantity); // Fallback for unidentified items
          }
        }

        // Process sale
        inventoryStore.removeItem(itemId, quantity);
        inventoryStore.addGold(sellPrice);

        return {
          success: true,
          goldGained: sellPrice,
        };
      },

      // Get price for consumable with reputation discount and session surcharge
      getConsumablePrice: (consumableId, quantity) => {
        const state = get();
        const stockItem = state.generalStock.find((s) => s.consumableId === consumableId);
        if (!stockItem) return 0;

        const purchaseCount = state.sessionPurchaseCounts[consumableId] ?? 0;
        const surchargeFactor = Math.pow(1.25, purchaseCount);
        const reputation = state.npcReputation.general;
        return applyReputationDiscount(
          Math.ceil(stockItem.basePrice * quantity * surchargeFactor),
          reputation
        );
      },

      // Get price for equipment with reputation discount
      getEquipmentPrice: (index) => {
        const state = get();
        const stockItem = state.equipmentStock[index];
        if (!stockItem) return 0;

        const reputation = state.npcReputation.equipment;
        return applyReputationDiscount(stockItem.basePrice, reputation);
      },

      // Get reputation for shop type
      getReputation: (shopType) => {
        return get().npcReputation[shopType];
      },

      // Add reputation
      addReputation: (shopType, amount) => {
        set((state) => ({
          npcReputation: {
            ...state.npcReputation,
            [shopType]: Math.max(-20, Math.min(20, state.npcReputation[shopType] + amount)),
          },
        }));
      },

      // Reset reputation to default (called on new character creation)
      resetReputation: () => {
        set({ npcReputation: DEFAULT_NPC_REPUTATION });
      },

      // Get available consumable stock
      getAvailableStock: () => {
        const state = get();
        return state.generalStock.filter((s) => s.quantity === -1 || s.quantity > 0);
      },

      // Get equipment for sale
      getEquipmentForSale: () => {
        const state = get();
        return state.equipmentStock.filter((s) => !s.sold);
      },
    }),
    {
      name: 'kohrvellia-shop',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        generalStock: state.generalStock,
        equipmentStock: state.equipmentStock,
        lastRefresh: state.lastRefresh,
        deepestFloorAtRefresh: state.deepestFloorAtRefresh,
        totalRunsAtRefresh: state.totalRunsAtRefresh,
        npcReputation: state.npcReputation,
      }),
    }
  )
);
