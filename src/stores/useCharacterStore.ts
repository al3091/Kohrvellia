/**
 * Character state store using Zustand
 * Manages player character, stats, equipment, and inventory
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Character,
  BackstoryId,
  StatusEffect,
  Skill,
  InventoryItem,
  PendingExcelia,
} from '../types/Character';
import { BAG_CAPACITY } from '../types/Character';
import type { AchievementProgress } from '../types/Achievement';
import type { Stats, StatName } from '../types/Stats';
import type { Equipment } from '../types/Armor';
import type { Weapon } from '../types/Weapon';
import type { Armor, Accessory } from '../types/Armor';

import {
  createNewCharacter,
  canLevelUp as checkCanLevelUp,
} from '../types/Character';
import {
  calculateEffectiveStat,
  calculateDerivedStats,
  getGradeFromPoints,
  getProficiencyThreshold,
  gradeToIndex,
  indexToGrade,
} from '../types/Stats';
import { calculateTotalDefense, calculateTotalMagicDefense } from '../types/Armor';
import { getBlessingMultiplier } from '../types/Deity';
import { QUALITY_OUTPUT_CAP_MULTIPLIER } from '../types/Weapon';
import type { QualityTier } from '../types/Weapon';
import { useAchievementStore } from './useAchievementStore';

/** Resolve weapon output cap — handles old saves that predate C2 (no maxOutputCap field) */
function resolveWeaponOutputCap(weapon: Weapon | null | undefined): number {
  if (!weapon) return Infinity;
  if (weapon.maxOutputCap != null) return weapon.maxOutputCap;
  // Legacy migration: compute from quality tier
  const mult = QUALITY_OUTPUT_CAP_MULTIPLIER[weapon.quality.tier as QualityTier] ?? 3;
  return Math.ceil(weapon.finalDamage * mult);
}

/**
 * Sum carry stats from level history for the effective stat formula.
 * Handles missing levelHistory (legacy saves) gracefully.
 */
function computeCarryStats(
  levelHistory: Character['levelHistory'] | undefined
): Partial<Record<StatName, number>> {
  if (!levelHistory || levelHistory.length === 0) return {};
  const carry: Record<StatName, number> = {
    STR: 0, PER: 0, END: 0, CHA: 0, INT: 0, AGI: 0, WIS: 0, LCK: 0,
  };
  for (const entry of levelHistory) {
    for (const stat of Object.keys(carry) as StatName[]) {
      carry[stat] += entry.stats[stat] ?? 0;
    }
  }
  return carry;
}

interface CharacterState {
  // Current character (null if no active game)
  character: Character | null;

  // Actions - Character lifecycle
  createCharacter: (
    name: string,
    epithet: string,
    backstory: BackstoryId,
    statAllocations?: Record<StatName, number>,
    deityStatBonus?: { stat: StatName; value: number }
  ) => void;
  deleteCharacter: () => void;

  // Actions - Stats
  addStatProficiency: (stat: StatName, amount: number) => void;
  setStatPoints: (stat: StatName, points: number) => void;

  // Actions - Pending Excelia (Falna system)
  initializePendingExcelia: () => void;
  addPendingExcelia: (stat: StatName, amount: number) => void;
  commitExcelia: () => { statsGained: Record<StatName, number>; gradeUps: Array<{ stat: StatName; newGrade: string }> };
  discardExcelia: () => void;
  hasPendingExcelia: () => boolean;
  getPendingExcelia: () => PendingExcelia | null;
  updatePendingExceliaStats: (floor: number, kills: number) => void;

  // Actions - Resources
  modifyHP: (amount: number) => void;
  modifySP: (amount: number) => void;
  modifyGold: (amount: number) => void;
  modifySatiation: (amount: number) => void;

  // Actions - Status effects
  addStatusEffect: (effect: StatusEffect) => void;
  removeStatusEffect: (effectId: string) => void;
  tickStatusEffects: () => void;

  // Actions - Equipment
  equipWeapon: (weapon: Weapon) => void;
  equipArmor: (armor: Armor, slot: 'head' | 'chest' | 'hands' | 'legs') => void;
  equipAccessory: (accessory: Accessory, slot: 'accessory1' | 'accessory2') => void;
  unequipSlot: (slot: keyof Equipment) => void;

  // Actions - Inventory
  addToInventory: (item: InventoryItem) => boolean; // Returns false if bag is full
  removeFromInventory: (itemId: string, quantity?: number) => void;
  destroyItem: (itemId: string) => void;
  dropEquipped: (slot: keyof Equipment) => void;
  equipFromInventory: (itemId: string) => boolean; // Equip a weapon/armor/accessory from inventory
  getInventoryCount: () => number; // Non-stackable items + number of stack types
  isBagFull: () => boolean;

  // Actions - Skills
  observeSkill: (skillId: string) => void;
  learnSkill: (skill: Skill) => void;
  useSkill: (skillId: string) => void;

  // Actions - Level up
  canLevelUp: () => boolean;
  addAchievementProgress: (progress: AchievementProgress) => void;
  setDeityApproval: (approved: boolean) => void;
  performLevelUp: () => void;

  // Actions - Run stats
  updateRunStats: (updates: Partial<Character['runStats']>) => void;

  // Actions - Deity
  setPatronDeity: (deityId: string) => void;
  modifyDeityFavor: (amount: number) => void;

  // Actions - Death
  killCharacter: () => void;

  // Actions - Primary stat
  setPrimaryStat: (stat: StatName) => void;

  // Computed values
  getEffectiveStats: () => Record<StatName, number>;
  getDerivedStats: () => ReturnType<typeof calculateDerivedStats>;
  getDerivedStatsWithBlessings: () => ReturnType<typeof calculateDerivedStats>;
  getBlessingMultiplier: () => number;
}

/**
 * Compute maxHP and maxSP from current character state.
 * Call this whenever stats, equipment, or deity favor changes to keep
 * the stored maxHP/maxSP values in sync with derived calculations.
 */
function computeMaxResources(
  level: number,
  stats: Stats,
  levelHistory: Character['levelHistory'] | undefined,
  equipment: Equipment,
  deityFavor: number
): { maxHP: number; maxSP: number } {
  const blessingMult = getBlessingMultiplier(deityFavor ?? 50);
  const weaponDamage = equipment.weapon?.finalDamage ?? 0;
  const armorDefense = calculateTotalDefense(equipment);
  const armorMagicDef = calculateTotalMagicDefense(equipment);
  const weaponOutputCap = resolveWeaponOutputCap(equipment.weapon);
  const carryStats = computeCarryStats(levelHistory);
  const derived = calculateDerivedStats(
    level, stats, carryStats, weaponDamage, 0, armorDefense, armorMagicDef, blessingMult, weaponOutputCap
  );
  return { maxHP: derived.maxHP, maxSP: derived.maxSP };
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      character: null,

      // Character lifecycle
      createCharacter: (name, epithet, backstory, statAllocations, deityStatBonus) => {
        const newCharacter = createNewCharacter(name, epithet, backstory, statAllocations, deityStatBonus);
        // Compute correct HP/SP from actual starting stats — createNewCharacter hardcodes 50/30
        const { maxHP, maxSP } = computeMaxResources(
          newCharacter.level,
          newCharacter.stats,
          newCharacter.levelHistory,
          newCharacter.equipment,
          newCharacter.deityFavor ?? 50
        );
        newCharacter.currentHP = maxHP;
        newCharacter.maxHP = maxHP;
        newCharacter.currentSP = maxSP;
        newCharacter.maxSP = maxSP;
        set({ character: newCharacter });
        // Reset shop reputation on new character (fresh start)
        // Lazy import avoids circular dependency: useCharacterStore ↔ useShopStore
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        (require('./useShopStore') as typeof import('./useShopStore')).useShopStore.getState().resetReputation();
      },

      deleteCharacter: () => {
        set({ character: null });
      },

      // Stats
      addStatProficiency: (stat, amount) => {
        set((state) => {
          if (!state.character) return state;

          const currentStat = state.character.stats[stat];
          let newProficiency = currentStat.proficiency + amount;
          let newPoints = currentStat.points;
          let newGrade = currentStat.grade;

          // Check for grade up
          const threshold = getProficiencyThreshold(currentStat.grade);
          while (newProficiency >= threshold && gradeToIndex(newGrade) < 11) {
            newProficiency -= threshold;
            const nextGradeIndex = gradeToIndex(newGrade) + 1;
            newGrade = indexToGrade(nextGradeIndex);
            // Points increase when grade increases
            newPoints = Math.min(999, newPoints + 100);
          }

          const newStats = {
            ...state.character.stats,
            [stat]: {
              grade: newGrade,
              points: newPoints,
              proficiency: newProficiency,
            },
          };
          const { maxHP: newMaxHP, maxSP: newMaxSP } = computeMaxResources(
            state.character.level,
            newStats,
            state.character.levelHistory,
            state.character.equipment,
            state.character.deityFavor ?? 50
          );

          return {
            character: {
              ...state.character,
              stats: newStats,
              maxHP: newMaxHP,
              maxSP: newMaxSP,
              currentHP: Math.min(state.character.currentHP, newMaxHP),
              currentSP: Math.min(state.character.currentSP, newMaxSP),
            },
          };
        });
      },

      setStatPoints: (stat, points) => {
        set((state) => {
          if (!state.character) return state;

          const clampedPoints = Math.max(0, Math.min(999, points));
          const newGrade = getGradeFromPoints(clampedPoints);

          return {
            character: {
              ...state.character,
              stats: {
                ...state.character.stats,
                [stat]: {
                  ...state.character.stats[stat],
                  points: clampedPoints,
                  grade: newGrade,
                },
              },
            },
          };
        });
      },

      // Pending Excelia (Falna system)
      initializePendingExcelia: () => {
        set((state) => {
          if (!state.character) return state;

          // ONLY initialize if pendingExcelia doesn't exist yet
          // This prevents resetting excelia on re-entry to dungeon
          if (state.character.pendingExcelia) {
            return state; // Already initialized, don't reset!
          }

          // Initialize fresh pending excelia for a new dungeon run
          const emptyStats: Record<StatName, number> = {
            STR: 0, PER: 0, END: 0, CHA: 0,
            INT: 0, AGI: 0, WIS: 0, LCK: 0,
          };

          return {
            character: {
              ...state.character,
              pendingExcelia: {
                stats: emptyStats,
                earnedAt: Date.now(),
                floorReached: 1,
                monstersKilled: 0,
              },
            },
          };
        });
      },

      addPendingExcelia: (stat, amount) => {
        set((state) => {
          if (!state.character) return state;

          // If no pending excelia exists, initialize it first
          let pending = state.character.pendingExcelia;
          if (!pending) {
            pending = {
              stats: { STR: 0, PER: 0, END: 0, CHA: 0, INT: 0, AGI: 0, WIS: 0, LCK: 0 },
              earnedAt: Date.now(),
              floorReached: 1,
              monstersKilled: 0,
            };
          }

          return {
            character: {
              ...state.character,
              pendingExcelia: {
                ...pending,
                stats: {
                  ...pending.stats,
                  [stat]: pending.stats[stat] + amount,
                },
              },
            },
          };
        });
      },

      commitExcelia: () => {
        const { character } = get();
        if (!character || !character.pendingExcelia) {
          return { statsGained: {} as Record<StatName, number>, gradeUps: [] };
        }

        const pending = character.pendingExcelia;
        const statsGained: Record<StatName, number> = { ...pending.stats };
        const gradeUps: Array<{ stat: StatName; newGrade: string }> = [];

        // Pre-compute the new stats and grade-ups BEFORE calling set()
        // This avoids the mutation-inside-set bug
        const newStats = { ...character.stats };

        for (const stat of Object.keys(pending.stats) as StatName[]) {
          const amount = pending.stats[stat];
          if (amount <= 0) continue;

          const currentStat = newStats[stat];
          const oldGrade = currentStat.grade;

          // FIXED: Proficiency gains should directly increase points
          // This makes stat growth visible and meaningful
          // Ratio: 1 proficiency = 1 point (can be tuned)
          const newPoints = Math.min(999, currentStat.points + amount);
          const newGrade = getGradeFromPoints(newPoints);

          // Track grade-ups
          if (gradeToIndex(newGrade) > gradeToIndex(oldGrade)) {
            // Could have multiple grade-ups if gain is large
            for (let g = gradeToIndex(oldGrade) + 1; g <= gradeToIndex(newGrade); g++) {
              gradeUps.push({ stat, newGrade: indexToGrade(g) });
            }
          }

          newStats[stat] = {
            grade: newGrade,
            points: newPoints,
            proficiency: 0, // Proficiency resets after commit
          };
        }

        // Compute new max resources using updated stats (before set)
        const { maxHP: newMaxHP, maxSP: newMaxSP } = computeMaxResources(
          character.level,
          newStats,
          character.levelHistory,
          character.equipment,
          character.deityFavor ?? 50
        );

        // Track stat grade-ups for achievements
        const GRADE_ORDER = ['I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
        const achievementStore = useAchievementStore.getState();
        for (const gu of gradeUps) {
          const idx = GRADE_ORDER.indexOf(gu.newGrade);
          if (idx >= 0) {
            achievementStore.updateProgress('stat_reach', idx);
          }
        }

        // Apply the pre-computed state
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              stats: newStats,
              pendingExcelia: null, // Clear pending after commit
              maxHP: newMaxHP,
              maxSP: newMaxSP,
              // Clamp current resources to new maximums
              currentHP: Math.min(state.character.currentHP, newMaxHP),
              currentSP: Math.min(state.character.currentSP, newMaxSP),
            },
          };
        });

        return { statsGained, gradeUps };
      },

      discardExcelia: () => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              pendingExcelia: null,
            },
          };
        });
      },

      hasPendingExcelia: () => {
        const { character } = get();
        if (!character || !character.pendingExcelia) return false;

        // Check if any stat has pending growth
        return Object.values(character.pendingExcelia.stats).some((v) => v > 0);
      },

      getPendingExcelia: () => {
        const { character } = get();
        return character?.pendingExcelia ?? null;
      },

      updatePendingExceliaStats: (floor, kills) => {
        set((state) => {
          if (!state.character) return state;

          // Auto-initialize if pendingExcelia doesn't exist
          let pending = state.character.pendingExcelia;
          if (!pending) {
            pending = {
              stats: { STR: 0, PER: 0, END: 0, CHA: 0, INT: 0, AGI: 0, WIS: 0, LCK: 0 },
              earnedAt: Date.now(),
              floorReached: 1,
              monstersKilled: 0,
            };
          }

          return {
            character: {
              ...state.character,
              pendingExcelia: {
                ...pending,
                floorReached: Math.max(pending.floorReached, floor),
                monstersKilled: pending.monstersKilled + kills,
              },
            },
          };
        });
      },

      // Resources
      modifyHP: (amount) => {
        set((state) => {
          if (!state.character) return state;

          const newHP = Math.max(0, Math.min(state.character.maxHP, state.character.currentHP + amount));
          const isDead = newHP <= 0;

          return {
            character: {
              ...state.character,
              currentHP: newHP,
              isDead,
            },
          };
        });
      },

      modifySP: (amount) => {
        set((state) => {
          if (!state.character) return state;

          const newSP = Math.max(0, Math.min(state.character.maxSP, state.character.currentSP + amount));

          return {
            character: {
              ...state.character,
              currentSP: newSP,
            },
          };
        });
      },

      modifyGold: (amount) => {
        set((state) => {
          if (!state.character) return state;

          const newGold = Math.max(0, state.character.gold + amount);

          return {
            character: {
              ...state.character,
              gold: newGold,
            },
          };
        });
      },

      modifySatiation: (amount) => {
        set((state) => {
          if (!state.character) return state;
          const current = state.character.satiation ?? 60;
          return {
            character: {
              ...state.character,
              satiation: Math.max(0, Math.min(100, current + amount)),
            },
          };
        });
      },

      // Status effects
      addStatusEffect: (effect) => {
        set((state) => {
          if (!state.character) return state;

          // Check if effect already exists, refresh duration if so
          const existing = state.character.statusEffects.findIndex((e) => e.id === effect.id);
          let newEffects: StatusEffect[];

          if (existing >= 0) {
            newEffects = [...state.character.statusEffects];
            newEffects[existing] = effect;
          } else {
            newEffects = [...state.character.statusEffects, effect];
          }

          return {
            character: {
              ...state.character,
              statusEffects: newEffects,
            },
          };
        });
      },

      removeStatusEffect: (effectId) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              statusEffects: state.character.statusEffects.filter((e) => e.id !== effectId),
            },
          };
        });
      },

      tickStatusEffects: () => {
        set((state) => {
          if (!state.character) return state;

          const updatedEffects = state.character.statusEffects
            .map((effect) => ({
              ...effect,
              duration: effect.duration - 1,
            }))
            .filter((effect) => effect.duration > 0);

          return {
            character: {
              ...state.character,
              statusEffects: updatedEffects,
            },
          };
        });
      },

      // Equipment - swapping equipment stores old item in inventory
      equipWeapon: (weapon) => {
        set((state) => {
          if (!state.character) return state;

          const oldWeapon = state.character.equipment.weapon;
          let newInventory = [...state.character.inventory];

          // If there's an old weapon, store it in inventory
          if (oldWeapon) {
            const inventoryItem: InventoryItem = {
              id: oldWeapon.id,
              type: 'weapon',
              stackable: false,
              quantity: 1,
              name: oldWeapon.displayName,
              icon: '⚔️',
              weaponData: oldWeapon,
            };
            newInventory = [...newInventory, inventoryItem];
          }

          return {
            character: {
              ...state.character,
              inventory: newInventory,
              equipment: {
                ...state.character.equipment,
                weapon,
              },
            },
          };
        });
      },

      equipArmor: (armor, slot) => {
        set((state) => {
          if (!state.character) return state;

          const oldArmor = state.character.equipment[slot] as Armor | null;
          let newInventory = [...state.character.inventory];

          // If there's old armor in this slot, store it in inventory
          if (oldArmor) {
            const inventoryItem: InventoryItem = {
              id: oldArmor.id,
              type: 'armor',
              stackable: false,
              quantity: 1,
              name: oldArmor.displayName,
              icon: '🛡️',
              armorData: oldArmor,
            };
            newInventory = [...newInventory, inventoryItem];
          }

          return {
            character: {
              ...state.character,
              inventory: newInventory,
              equipment: {
                ...state.character.equipment,
                [slot]: armor,
              },
            },
          };
        });
      },

      equipAccessory: (accessory, slot) => {
        set((state) => {
          if (!state.character) return state;

          const oldAccessory = state.character.equipment[slot] as Accessory | null;
          let newInventory = [...state.character.inventory];

          // If there's an old accessory in this slot, store it in inventory
          if (oldAccessory) {
            const inventoryItem: InventoryItem = {
              id: oldAccessory.id,
              type: 'accessory',
              stackable: false,
              quantity: 1,
              name: oldAccessory.name,
              icon: '💍',
              accessoryData: oldAccessory,
            };
            newInventory = [...newInventory, inventoryItem];
          }

          return {
            character: {
              ...state.character,
              inventory: newInventory,
              equipment: {
                ...state.character.equipment,
                [slot]: accessory,
              },
            },
          };
        });
      },

      unequipSlot: (slot) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              equipment: {
                ...state.character.equipment,
                [slot]: null,
              },
            },
          };
        });
      },

      // Inventory
      addToInventory: (item) => {
        const { character } = get();
        if (!character) return false;

        // Check for stackable items - stacking doesn't count against capacity
        if (item.stackable) {
          const existing = character.inventory.find((i) => i.id === item.id);
          if (existing) {
            set((state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  inventory: state.character.inventory.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                  ),
                },
              };
            });
            return true;
          }
        }

        // Check bag capacity before adding new item slot
        const currentSlots = character.inventory.length;
        if (currentSlots >= BAG_CAPACITY) {
          return false; // Bag is full
        }

        set((state) => {
          if (!state.character) return state;
          return {
            character: {
              ...state.character,
              inventory: [...state.character.inventory, item],
            },
          };
        });
        return true;
      },

      removeFromInventory: (itemId, quantity = 1) => {
        set((state) => {
          if (!state.character) return state;

          const item = state.character.inventory.find((i) => i.id === itemId);
          if (!item) return state;

          if (item.stackable && item.quantity > quantity) {
            return {
              character: {
                ...state.character,
                inventory: state.character.inventory.map((i) =>
                  i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
                ),
              },
            };
          }

          return {
            character: {
              ...state.character,
              inventory: state.character.inventory.filter((i) => i.id !== itemId),
            },
          };
        });
      },

      destroyItem: (itemId) => {
        set((state) => {
          if (!state.character) return state;

          // Remove item completely regardless of stack size
          return {
            character: {
              ...state.character,
              inventory: state.character.inventory.filter((i) => i.id !== itemId),
            },
          };
        });
      },

      dropEquipped: (slot) => {
        set((state) => {
          if (!state.character) return state;

          // Drop equipped item without adding to inventory (permanently destroyed)
          return {
            character: {
              ...state.character,
              equipment: {
                ...state.character.equipment,
                [slot]: null,
              },
            },
          };
        });
      },

      equipFromInventory: (itemId) => {
        const { character } = get();
        if (!character) return false;

        const item = character.inventory.find((i) => i.id === itemId);
        if (!item) return false;

        // Equip based on item type
        if (item.type === 'weapon' && item.weaponData) {
          // equipWeapon handles storing old weapon in inventory
          get().equipWeapon(item.weaponData);
          // Remove the equipped item from inventory
          get().removeFromInventory(itemId);
          return true;
        }

        if (item.type === 'armor' && item.armorData) {
          // Determine the slot based on armor slot property
          const slot = item.armorData.base.slot as 'head' | 'chest' | 'hands' | 'legs';
          get().equipArmor(item.armorData, slot);
          get().removeFromInventory(itemId);
          return true;
        }

        if (item.type === 'accessory' && item.accessoryData) {
          // Default to accessory1 slot, could add slot selection later
          get().equipAccessory(item.accessoryData, 'accessory1');
          get().removeFromInventory(itemId);
          return true;
        }

        return false;
      },

      getInventoryCount: () => {
        const { character } = get();
        if (!character) return 0;
        return character.inventory.length;
      },

      isBagFull: () => {
        const { character } = get();
        if (!character) return true;
        return character.inventory.length >= BAG_CAPACITY;
      },

      // Skills
      observeSkill: (skillId) => {
        set((state) => {
          if (!state.character) return state;
          if (state.character.observedSkills.includes(skillId)) return state;

          return {
            character: {
              ...state.character,
              observedSkills: [...state.character.observedSkills, skillId],
            },
          };
        });
      },

      learnSkill: (skill) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              skills: [...state.character.skills, { ...skill, learned: true }],
            },
          };
        });
      },

      useSkill: (skillId) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              skills: state.character.skills.map((s) =>
                s.id === skillId ? { ...s, currentCooldown: s.cooldown } : s
              ),
            },
          };
        });
      },

      // Level up
      canLevelUp: () => {
        const { character } = get();
        if (!character) return false;
        return checkCanLevelUp(character);
      },

      addAchievementProgress: (progress) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              levelProgress: {
                ...state.character.levelProgress,
                achievementsCompleted: [
                  ...state.character.levelProgress.achievementsCompleted,
                  progress,
                ],
              },
            },
          };
        });
      },

      setDeityApproval: (approved) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              levelProgress: {
                ...state.character.levelProgress,
                deityApproved: approved,
              },
            },
          };
        });
      },

      performLevelUp: () => {
        // IMPORTANT: Auto-commit any pending excelia before level-up
        // This prevents losing stat gains if player didn't visit Blessing Rite
        const { character } = get();
        if (character?.pendingExcelia) {
          get().commitExcelia();
        }

        set((state) => {
          if (!state.character) return state;
          if (!checkCanLevelUp(state.character)) return state;

          const newLevel = state.character.level + 1;

          // Save current stat points to level history BEFORE resetting.
          // This carry accumulates permanently and feeds into calculateEffectiveStat().
          const finalStats: Record<StatName, number> = {} as Record<StatName, number>;
          for (const stat of Object.keys(state.character.stats) as StatName[]) {
            finalStats[stat] = state.character.stats[stat].points;
          }
          const newHistory: Character['levelHistory'] = [
            ...(state.character.levelHistory ?? []),
            { level: state.character.level, stats: finalStats },
          ];

          // DanMachi-style level up: current stats reset to Grade I.
          // Previous stat points are NOT lost — they live in levelHistory and carry forward.
          const resetStats: Stats = { ...state.character.stats };
          for (const stat of Object.keys(resetStats) as StatName[]) {
            resetStats[stat] = {
              grade: 'I',
              points: 0,
              proficiency: 0,
            };
          }

          const { maxHP: newMaxHP, maxSP: newMaxSP } = computeMaxResources(
            newLevel,
            resetStats,
            newHistory,
            state.character.equipment,
            state.character.deityFavor ?? 50
          );

          return {
            character: {
              ...state.character,
              level: newLevel,
              stats: resetStats,
              levelHistory: newHistory,
              maxHP: newMaxHP,
              maxSP: newMaxSP,
              currentHP: Math.min(state.character.currentHP, newMaxHP),
              currentSP: Math.min(state.character.currentSP, newMaxSP),
              levelProgress: {
                achievementsCompleted: [],
                allStatsAtD: false,
                deityApproved: false,
              },
            },
          };
        });

        // Reveal next level's standard achievements after level-up
        const updatedCharacter = get().character;
        if (updatedCharacter) {
          useAchievementStore.getState().unlockAchievementsForLevel(updatedCharacter.level + 1);
        }
      },

      // Run stats
      updateRunStats: (updates) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              runStats: {
                ...state.character.runStats,
                ...updates,
              },
            },
          };
        });
      },

      // Deity
      setPatronDeity: (deityId) => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              patronDeityId: deityId,
              deityFavor: 50,
            },
          };
        });
      },

      modifyDeityFavor: (amount) => {
        set((state) => {
          if (!state.character) return state;

          const newFavor = Math.max(0, Math.min(100, state.character.deityFavor + amount));
          const { maxHP: newMaxHP, maxSP: newMaxSP } = computeMaxResources(
            state.character.level,
            state.character.stats,
            state.character.levelHistory,
            state.character.equipment,
            newFavor
          );

          return {
            character: {
              ...state.character,
              deityFavor: newFavor,
              maxHP: newMaxHP,
              maxSP: newMaxSP,
              currentHP: Math.min(state.character.currentHP, newMaxHP),
              currentSP: Math.min(state.character.currentSP, newMaxSP),
            },
          };
        });
      },

      // Death
      killCharacter: () => {
        set((state) => {
          if (!state.character) return state;

          return {
            character: {
              ...state.character,
              isDead: true,
              currentHP: 0,
            },
          };
        });
      },

      // Primary stat
      setPrimaryStat: (stat) => {
        set((state) => {
          if (!state.character) return state;
          return {
            character: {
              ...state.character,
              primaryStatHistory: [
                ...(state.character.primaryStatHistory ?? []),
                stat,
              ],
            },
          };
        });
      },

      // Computed values
      getEffectiveStats: () => {
        const { character } = get();
        if (!character) {
          return {
            STR: 0, PER: 0, END: 0, CHA: 0,
            INT: 0, AGI: 0, WIS: 0, LCK: 0,
          };
        }

        const result: Record<StatName, number> = {} as Record<StatName, number>;
        const carry = computeCarryStats(character.levelHistory);
        for (const stat of Object.keys(character.stats) as StatName[]) {
          result[stat] = calculateEffectiveStat(character.level, character.stats[stat].points, carry[stat as StatName] ?? 0);
        }
        return result;
      },

      getDerivedStats: () => {
        const { character } = get();
        if (!character) {
          return {
            maxHP: 50, maxSP: 30, physicalAttack: 0, magicAttack: 0,
            physicalDefense: 0, magicDefense: 0, speed: 0, critChance: 5, dodgeChance: 0,
          } as unknown as ReturnType<typeof calculateDerivedStats>;
        }

        const carryStats = computeCarryStats(character.levelHistory);
        const weaponDamage = character.equipment.weapon?.finalDamage ?? 0;
        const weaponMagic = 0; // TODO: Add magic weapon support
        const armorDefense = calculateTotalDefense(character.equipment);
        const armorMagicDef = calculateTotalMagicDefense(character.equipment);
        const weaponOutputCap = resolveWeaponOutputCap(character.equipment.weapon);

        return calculateDerivedStats(
          character.level,
          character.stats,
          carryStats,
          weaponDamage,
          weaponMagic,
          armorDefense,
          armorMagicDef,
          1.0,
          weaponOutputCap
        );
      },

      /**
       * Get derived stats WITH deity blessing multiplier applied
       * Use this for combat calculations - deity favor directly impacts power
       */
      getDerivedStatsWithBlessings: () => {
        const { character } = get();
        if (!character) {
          return {
            maxHP: 50, maxSP: 30, physicalAttack: 0, magicAttack: 0,
            physicalDefense: 0, magicDefense: 0, speed: 0, critChance: 5, dodgeChance: 0,
          } as unknown as ReturnType<typeof calculateDerivedStats>;
        }

        // Get blessing multiplier from deity favor (0.5 to 1.5)
        const blessingMult = getBlessingMultiplier(character.deityFavor ?? 50);

        const carryStats = computeCarryStats(character.levelHistory);
        const weaponDamage = character.equipment.weapon?.finalDamage ?? 0;
        const weaponMagic = 0; // TODO: Add magic weapon support
        const armorDefense = calculateTotalDefense(character.equipment);
        const armorMagicDef = calculateTotalMagicDefense(character.equipment);
        const weaponOutputCap = resolveWeaponOutputCap(character.equipment.weapon);

        return calculateDerivedStats(
          character.level,
          character.stats,
          carryStats,
          weaponDamage,
          weaponMagic,
          armorDefense,
          armorMagicDef,
          blessingMult,
          weaponOutputCap
        );
      },

      /**
       * Get current blessing multiplier from deity favor
       */
      getBlessingMultiplier: () => {
        const { character } = get();
        if (!character) return 1.0;
        return getBlessingMultiplier(character.deityFavor ?? 50);
      },
    }),
    {
      name: 'kohrvellia-character',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
