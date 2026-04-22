/**
 * Blacksmith state store using Zustand
 * Handles identification, upgrades, and reputation with the blacksmith NPC
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Weapon, QualityTier, WeaponQuality } from '../types/Weapon';
import type { MaterialRequirement } from '../types/Blacksmith';
import {
  IDENTIFICATION_COST,
  getUpgradeRequirement,
  getNextQuality,
} from '../types/Blacksmith';
import { getMaterialById } from '../data/materials';
import { getWeaponById, updateWeapon } from '../data/weaponRegistry';
import { useCharacterStore } from './useCharacterStore';
import { useInventoryStore } from './useInventoryStore';
import { QUALITY_TIERS, generateWeaponDisplayName, calculateWeaponDamage } from '../types/Weapon';

export interface IdentificationResult {
  success: boolean;
  weapon?: Weapon;
  error?: string;
}

export interface UpgradeResult {
  success: boolean;
  weapon?: Weapon;
  error?: string;
}

interface BlacksmithState {
  // Reputation with the blacksmith (affects dialogue, unlocks services)
  reputation: number;

  // Track total business done
  totalGoldSpent: number;
  itemsIdentified: number;
  itemsUpgraded: number;

  // Actions - Reputation
  modifyReputation: (amount: number) => void;
  getReputationTier: () => 'hostile' | 'neutral' | 'friendly' | 'trusted';

  // Actions - Identification
  canIdentify: (weaponId: string) => boolean;
  identifyWeapon: (weaponId: string) => IdentificationResult;
  getIdentificationCost: () => number;

  // Actions - Upgrades
  canUpgrade: (weaponId: string) => { canUpgrade: boolean; reason?: string };
  getUpgradeCost: (weaponId: string) => ReturnType<typeof getUpgradeRequirement>;
  upgradeWeapon: (weaponId: string) => UpgradeResult;
  hasRequiredMaterials: (requirements: MaterialRequirement[]) => boolean;
  getMaterialInventory: (materialId: string) => number;

  // Actions - Utility
  getUnidentifiedWeapons: () => Array<{ id: string; weapon: Weapon }>;
  getUpgradeableWeapons: () => Array<{ id: string; weapon: Weapon }>;
}

export const useBlacksmithStore = create<BlacksmithState>()(
  persist(
    (set, get) => ({
      reputation: 1, // Start neutral-positive
      totalGoldSpent: 0,
      itemsIdentified: 0,
      itemsUpgraded: 0,

      // Reputation
      modifyReputation: (amount) => {
        set((state) => ({
          reputation: Math.max(-20, Math.min(20, state.reputation + amount)),
        }));
      },

      getReputationTier: () => {
        const rep = get().reputation;
        if (rep <= -5) return 'hostile';
        if (rep < 6) return 'neutral';
        if (rep < 16) return 'friendly';
        return 'trusted';
      },

      // Identification
      canIdentify: (weaponId) => {
        const character = useCharacterStore.getState().character;
        if (!character) return false;

        // Check if item is in inventory
        const item = character.inventory.find((i) => i.id === weaponId && i.type === 'weapon');
        if (!item) return false;

        // Get weapon from registry
        const weapon = getWeaponById(weaponId);
        if (!weapon) return false;

        // Check if already identified
        if (weapon.identified) return false;

        // Check gold
        return character.gold >= IDENTIFICATION_COST;
      },

      identifyWeapon: (weaponId) => {
        const character = useCharacterStore.getState().character;
        const characterStore = useCharacterStore.getState();
        if (!character) {
          return { success: false, error: 'No character found' };
        }

        // Check if item is in inventory
        const itemIndex = character.inventory.findIndex(
          (i) => i.id === weaponId && i.type === 'weapon'
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Weapon not found in inventory' };
        }

        // Get weapon from registry
        const weapon = getWeaponById(weaponId);
        if (!weapon) {
          return { success: false, error: 'Weapon data not found' };
        }

        if (weapon.identified) {
          return { success: false, error: 'Weapon already identified' };
        }

        // Check gold
        if (character.gold < IDENTIFICATION_COST) {
          return { success: false, error: `Need ${IDENTIFICATION_COST}G to identify` };
        }

        // Spend gold
        characterStore.modifyGold(-IDENTIFICATION_COST);

        // Identify the weapon in registry
        const identifiedWeapon: Weapon = {
          ...weapon,
          identified: true,
        };
        updateWeapon(identifiedWeapon);

        // Update the inventory item's identified flag
        const updatedInventory = [...character.inventory];
        updatedInventory[itemIndex] = {
          ...updatedInventory[itemIndex],
          identified: true,
        };

        // Update character inventory using the existing store method
        // Since there's no direct setCharacter, we use the store's internals
        useCharacterStore.setState({
          character: {
            ...character,
            gold: character.gold - IDENTIFICATION_COST,
            inventory: updatedInventory,
          },
        });

        // Update stats
        set((state) => ({
          totalGoldSpent: state.totalGoldSpent + IDENTIFICATION_COST,
          itemsIdentified: state.itemsIdentified + 1,
          reputation: Math.min(20, state.reputation + 0.5), // Small rep gain
        }));

        return { success: true, weapon: identifiedWeapon };
      },

      getIdentificationCost: () => IDENTIFICATION_COST,

      // Upgrades
      canUpgrade: (weaponId) => {
        const character = useCharacterStore.getState().character;
        if (!character) {
          return { canUpgrade: false, reason: 'No character found' };
        }

        // Check if item is in inventory
        const item = character.inventory.find((i) => i.id === weaponId && i.type === 'weapon');
        if (!item) {
          return { canUpgrade: false, reason: 'Weapon not found' };
        }

        // Get weapon from registry
        const weapon = getWeaponById(weaponId);
        if (!weapon) {
          return { canUpgrade: false, reason: 'Weapon data not found' };
        }

        // Must be identified first
        if (!weapon.identified) {
          return { canUpgrade: false, reason: 'Weapon must be identified first' };
        }

        // Check if already at max quality
        const currentQuality = weapon.quality.tier;
        if (currentQuality === 'legendary') {
          return { canUpgrade: false, reason: 'Already at maximum quality' };
        }

        // Get upgrade requirements
        const requirement = getUpgradeRequirement(currentQuality);
        if (!requirement) {
          return { canUpgrade: false, reason: 'No upgrade path available' };
        }

        // Check reputation requirement
        if (requirement.requiredReputation && get().reputation < requirement.requiredReputation) {
          return {
            canUpgrade: false,
            reason: `Requires ${requirement.requiredReputation} reputation with Garm`,
          };
        }

        // Check quest requirement
        if (requirement.questRequired) {
          // TODO: Check quest completion when quest system is implemented
          return { canUpgrade: false, reason: 'Requires special quest completion' };
        }

        // Check gold
        if (character.gold < requirement.goldCost) {
          return { canUpgrade: false, reason: `Need ${requirement.goldCost}G` };
        }

        // Check materials
        if (!get().hasRequiredMaterials(requirement.materials)) {
          const missingMats = requirement.materials
            .filter((m) => get().getMaterialInventory(m.materialId) < m.quantity)
            .map((m) => {
              const mat = getMaterialById(m.materialId);
              const have = get().getMaterialInventory(m.materialId);
              return `${mat?.name || m.materialId}: ${have}/${m.quantity}`;
            })
            .join(', ');
          return { canUpgrade: false, reason: `Missing materials: ${missingMats}` };
        }

        return { canUpgrade: true };
      },

      getUpgradeCost: (weaponId) => {
        const weapon = getWeaponById(weaponId);
        if (!weapon) return null;
        return getUpgradeRequirement(weapon.quality.tier);
      },

      upgradeWeapon: (weaponId) => {
        const { canUpgrade, reason } = get().canUpgrade(weaponId);
        if (!canUpgrade) {
          return { success: false, error: reason };
        }

        const character = useCharacterStore.getState().character;
        const characterStore = useCharacterStore.getState();
        const inventoryStore = useInventoryStore.getState();
        if (!character) {
          return { success: false, error: 'No character found' };
        }

        // Get weapon from registry
        const weapon = getWeaponById(weaponId);
        if (!weapon) {
          return { success: false, error: 'Weapon data not found' };
        }

        const requirement = getUpgradeRequirement(weapon.quality.tier)!;

        // Spend gold
        characterStore.modifyGold(-requirement.goldCost);

        // Consume materials
        const materialRequirements = requirement.materials.map((m) => ({
          id: m.materialId,
          quantity: m.quantity,
        }));
        inventoryStore.consumeMaterials(materialRequirements);

        // Upgrade the weapon
        const nextQualityTier = getNextQuality(weapon.quality.tier) as QualityTier;
        const qualityData = getQualityData(nextQualityTier);

        const upgradedWeapon: Weapon = {
          ...weapon,
          quality: qualityData,
          // Recalculate final stats
          finalDamage: calculateUpgradedDamage(weapon, qualityData),
          finalAccuracy: calculateUpgradedAccuracy(weapon, qualityData),
          finalCritChance: calculateUpgradedCrit(weapon, qualityData),
          displayName: generateUpgradedName(weapon, qualityData),
        };

        // Update weapon in registry
        updateWeapon(upgradedWeapon);

        // Update stats and reputation
        const repGain = getReputationGainForUpgrade(requirement.goldCost);
        set((state) => ({
          totalGoldSpent: state.totalGoldSpent + requirement.goldCost,
          itemsUpgraded: state.itemsUpgraded + 1,
          reputation: Math.min(20, state.reputation + repGain),
        }));

        return { success: true, weapon: upgradedWeapon };
      },

      hasRequiredMaterials: (requirements) => {
        for (const req of requirements) {
          if (get().getMaterialInventory(req.materialId) < req.quantity) {
            return false;
          }
        }
        return true;
      },

      getMaterialInventory: (materialId) => {
        return useInventoryStore.getState().getItemCount(materialId);
      },

      // Utility
      getUnidentifiedWeapons: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return [];

        return character.inventory
          .filter((i) => i.type === 'weapon')
          .map((i) => ({ id: i.id, weapon: getWeaponById(i.id) }))
          .filter((item): item is { id: string; weapon: Weapon } =>
            item.weapon !== undefined && !item.weapon.identified
          );
      },

      getUpgradeableWeapons: () => {
        const character = useCharacterStore.getState().character;
        if (!character) return [];

        return character.inventory
          .filter((i) => i.type === 'weapon')
          .map((i) => ({ id: i.id, weapon: getWeaponById(i.id) }))
          .filter((item): item is { id: string; weapon: Weapon } =>
            item.weapon !== undefined &&
            item.weapon.identified &&
            item.weapon.quality.tier !== 'legendary'
          );
      },
    }),
    {
      name: 'kohrvellia-blacksmith',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reputation: state.reputation,
        totalGoldSpent: state.totalGoldSpent,
        itemsIdentified: state.itemsIdentified,
        itemsUpgraded: state.itemsUpgraded,
      }),
    }
  )
);

// ===== HELPER FUNCTIONS =====

function getQualityData(tier: QualityTier): WeaponQuality {
  const tierData = QUALITY_TIERS[tier];
  const names: Record<QualityTier, string> = {
    crude: 'Crude',
    standard: 'Standard',
    fine: 'Fine',
    superior: 'Superior',
    masterwork: 'Masterwork',
    legendary: 'Legendary',
  };

  return {
    id: tier,
    name: names[tier],
    tier: tier,
    accuracyModifier: tierData.accuracy,
    critModifier: tierData.crit,
    damageModifier: tierData.damage,
    minFloor: tierData.minFloor,
  };
}

function calculateUpgradedDamage(weapon: Weapon, newQuality: WeaponQuality): number {
  return calculateWeaponDamage(weapon.base.baseDamage, weapon.material, newQuality);
}

function calculateUpgradedAccuracy(weapon: Weapon, newQuality: WeaponQuality): number {
  const baseAcc = weapon.base.baseAccuracy;
  return Math.floor(baseAcc * (1 + newQuality.accuracyModifier));
}

function calculateUpgradedCrit(weapon: Weapon, newQuality: WeaponQuality): number {
  const baseCrit = weapon.base.baseCritChance;
  return baseCrit + newQuality.critModifier;
}

function generateUpgradedName(weapon: Weapon, newQuality: WeaponQuality): string {
  const tempWeapon: Weapon = {
    ...weapon,
    quality: newQuality,
  };
  return generateWeaponDisplayName(tempWeapon);
}

function getReputationGainForUpgrade(goldCost: number): number {
  // More expensive upgrades = more reputation
  if (goldCost >= 5000) return 2;
  if (goldCost >= 1000) return 1;
  return 0.5;
}
