/**
 * Soul System (Denatus) state store using Zustand
 * Manages hidden behavioral tracking for Paragon title generation at Level 10
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StatName } from '../types/Stats';
import type {
  BehaviorVector,
  Behavement,
  BehavementProgress,
  DenatusState,
  GeneratedTitle,
  DeityHint,
} from '../types/Behavement';
import {
  createInitialDenatusState,
  createBehavementProgress,
  calculateVectorScores,
  calculateBehavementScore,
  getDominantVector,
  generateParagonTitle,
} from '../types/Behavement';

// ===== BEHAVEMENT DEFINITIONS =====
// These are the trackable behaviors that contribute to the Paragon title

const BEHAVEMENT_DEFINITIONS: Behavement[] = [
  // COMBAT_PHYSICAL (10 behavements)
  { id: 'phys_attacks_100', name: 'Hundred Blows', description: 'Land 100 physical attacks', vector: 'COMBAT_PHYSICAL', target: 100, weight: 'easy', trackingType: 'cumulative' },
  { id: 'phys_attacks_500', name: 'Relentless Striker', description: 'Land 500 physical attacks', vector: 'COMBAT_PHYSICAL', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'phys_kills_50', name: 'Bloodied Blade', description: 'Kill 50 enemies with physical attacks', vector: 'COMBAT_PHYSICAL', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'phys_kills_200', name: 'Butcher', description: 'Kill 200 enemies with physical attacks', vector: 'COMBAT_PHYSICAL', target: 200, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'phys_crits_25', name: 'Precision Striker', description: 'Land 25 critical hits', vector: 'COMBAT_PHYSICAL', target: 25, weight: 'easy', trackingType: 'cumulative' },
  { id: 'phys_crits_100', name: 'Critical Master', description: 'Land 100 critical hits', vector: 'COMBAT_PHYSICAL', target: 100, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'phys_overkill_10', name: 'Overkill Artist', description: 'Deal 3x lethal damage 10 times', vector: 'COMBAT_PHYSICAL', target: 10, weight: 'hard', trackingType: 'cumulative' },
  { id: 'phys_boss_melee', name: 'Boss Slayer', description: 'Kill 5 bosses with melee weapons', vector: 'COMBAT_PHYSICAL', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'phys_str_weapon_kills', name: 'Strength Devotee', description: 'Kill 100 enemies with STR weapons', vector: 'COMBAT_PHYSICAL', target: 100, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'phys_consecutive_kills', name: 'Killing Spree', description: 'Kill 5 enemies without taking damage', vector: 'COMBAT_PHYSICAL', target: 5, weight: 'hard', trackingType: 'consecutive' },

  // COMBAT_MAGIC (10 behavements)
  { id: 'magic_attacks_100', name: 'Spell Weaver', description: 'Cast 100 offensive spells', vector: 'COMBAT_MAGIC', target: 100, weight: 'easy', trackingType: 'cumulative' },
  { id: 'magic_attacks_500', name: 'Arcane Master', description: 'Cast 500 offensive spells', vector: 'COMBAT_MAGIC', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'magic_kills_50', name: 'Elemental Fury', description: 'Kill 50 enemies with magic', vector: 'COMBAT_MAGIC', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'magic_kills_200', name: 'Sorcerous Devastation', description: 'Kill 200 enemies with magic', vector: 'COMBAT_MAGIC', target: 200, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'magic_sp_spent_1000', name: 'Mana Burner', description: 'Spend 1000 SP on spells', vector: 'COMBAT_MAGIC', target: 1000, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'magic_int_weapon_kills', name: 'Intelligence Devotee', description: 'Kill 100 enemies with INT weapons', vector: 'COMBAT_MAGIC', target: 100, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'magic_wis_weapon_kills', name: 'Wisdom Devotee', description: 'Kill 100 enemies with WIS weapons', vector: 'COMBAT_MAGIC', target: 100, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'magic_status_kills', name: 'Death by Attrition', description: 'Kill 25 enemies via status effects', vector: 'COMBAT_MAGIC', target: 25, weight: 'hard', trackingType: 'cumulative' },
  { id: 'magic_boss_spell', name: 'Arcane Executioner', description: 'Kill 5 bosses with magic', vector: 'COMBAT_MAGIC', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'magic_no_physical', name: 'Pure Caster', description: 'Clear a floor using only magic attacks', vector: 'COMBAT_MAGIC', target: 1, weight: 'very_hard', trackingType: 'threshold' },

  // DEFENSE_TANK (10 behavements)
  { id: 'tank_blocks_50', name: 'Shield Wall', description: 'Block 50 attacks', vector: 'DEFENSE_TANK', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'tank_blocks_200', name: 'Immovable Object', description: 'Block 200 attacks', vector: 'DEFENSE_TANK', target: 200, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'tank_damage_taken_1000', name: 'Pain Absorber', description: 'Take 1000 total damage', vector: 'DEFENSE_TANK', target: 1000, weight: 'easy', trackingType: 'cumulative' },
  { id: 'tank_damage_taken_5000', name: 'Living Fortress', description: 'Take 5000 total damage', vector: 'DEFENSE_TANK', target: 5000, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'tank_survive_low_hp', name: 'Clutch Survivor', description: 'Survive 10 fights below 20% HP', vector: 'DEFENSE_TANK', target: 10, weight: 'hard', trackingType: 'cumulative' },
  { id: 'tank_end_growth', name: 'Endurance Training', description: 'Gain 500 END proficiency', vector: 'DEFENSE_TANK', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'tank_no_flee', name: 'Stand Your Ground', description: 'Win 20 fights without fleeing', vector: 'DEFENSE_TANK', target: 20, weight: 'easy', trackingType: 'cumulative' },
  { id: 'tank_shield_kills', name: 'Shield Mastery', description: 'Kill 50 enemies with END weapons', vector: 'DEFENSE_TANK', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'tank_heal_received', name: 'Regeneration', description: 'Heal 2000 HP total', vector: 'DEFENSE_TANK', target: 2000, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'tank_boss_no_death', name: 'Unbreakable', description: 'Kill 3 bosses without dying', vector: 'DEFENSE_TANK', target: 3, weight: 'hard', trackingType: 'cumulative' },

  // DEFENSE_EVASION (10 behavements)
  { id: 'evade_dodges_50', name: 'Nimble', description: 'Dodge 50 attacks', vector: 'DEFENSE_EVASION', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'evade_dodges_200', name: 'Untouchable', description: 'Dodge 200 attacks', vector: 'DEFENSE_EVASION', target: 200, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'evade_flees_10', name: 'Tactical Retreat', description: 'Successfully flee 10 times', vector: 'DEFENSE_EVASION', target: 10, weight: 'easy', trackingType: 'cumulative' },
  { id: 'evade_flees_50', name: 'Escape Artist', description: 'Successfully flee 50 times', vector: 'DEFENSE_EVASION', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'evade_agi_growth', name: 'Agility Training', description: 'Gain 500 AGI proficiency', vector: 'DEFENSE_EVASION', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'evade_no_damage_fight', name: 'Perfect Evasion', description: 'Win 5 fights taking no damage', vector: 'DEFENSE_EVASION', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'evade_dagger_kills', name: 'Dagger Dancer', description: 'Kill 50 enemies with AGI weapons', vector: 'DEFENSE_EVASION', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'evade_lucky_dodges', name: 'Lucky Feet', description: 'Dodge 20 attacks via LCK', vector: 'DEFENSE_EVASION', target: 20, weight: 'hard', trackingType: 'cumulative' },
  { id: 'evade_consecutive_dodges', name: 'Dance of Shadows', description: 'Dodge 3 consecutive attacks', vector: 'DEFENSE_EVASION', target: 3, weight: 'hard', trackingType: 'consecutive' },
  { id: 'evade_boss_no_hit', name: 'Ghost Fighter', description: 'Kill a boss without being hit', vector: 'DEFENSE_EVASION', target: 1, weight: 'very_hard', trackingType: 'threshold' },

  // RISK_TAKING (8 behavements)
  { id: 'risk_low_hp_attacks', name: 'Berserker', description: 'Attack 20 times below 30% HP', vector: 'RISK_TAKING', target: 20, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'risk_no_heal_floor', name: 'Iron Will', description: 'Clear 5 floors without healing', vector: 'RISK_TAKING', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'risk_boss_rush', name: 'Boss Rush', description: 'Fight a boss without resting first', vector: 'RISK_TAKING', target: 5, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'risk_trap_triggers', name: 'Trap Walker', description: 'Trigger 20 traps', vector: 'RISK_TAKING', target: 20, weight: 'easy', trackingType: 'cumulative' },
  { id: 'risk_elite_fights', name: 'Elite Hunter', description: 'Defeat 10 elite monsters', vector: 'RISK_TAKING', target: 10, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'risk_lck_weapon_use', name: 'Gambler\'s Choice', description: 'Kill 25 enemies with LCK weapons', vector: 'RISK_TAKING', target: 25, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'risk_near_death_wins', name: 'Death\'s Door', description: 'Win 5 fights with <10% HP remaining', vector: 'RISK_TAKING', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'risk_no_observe', name: 'Blind Fury', description: 'Kill 50 enemies without observing them', vector: 'RISK_TAKING', target: 50, weight: 'moderate', trackingType: 'cumulative' },

  // CAUTION (8 behavements)
  { id: 'caution_observes', name: 'Analyst', description: 'Observe 50 enemies', vector: 'CAUTION', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'caution_observes_200', name: 'Know Your Enemy', description: 'Observe 200 enemies', vector: 'CAUTION', target: 200, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'caution_rest_sites', name: 'Well Rested', description: 'Use 20 rest sites', vector: 'CAUTION', target: 20, weight: 'easy', trackingType: 'cumulative' },
  { id: 'caution_full_hp_fights', name: 'Prepared Fighter', description: 'Start 30 fights at full HP', vector: 'CAUTION', target: 30, weight: 'easy', trackingType: 'cumulative' },
  { id: 'caution_consumable_use', name: 'Potion Master', description: 'Use 30 consumables', vector: 'CAUTION', target: 30, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'caution_wis_growth', name: 'Wisdom Training', description: 'Gain 500 WIS proficiency', vector: 'CAUTION', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'caution_no_traps', name: 'Careful Step', description: 'Clear 5 floors without triggering traps', vector: 'CAUTION', target: 5, weight: 'hard', trackingType: 'cumulative' },
  { id: 'caution_heal_before_boss', name: 'Boss Preparation', description: 'Enter 5 boss rooms at full HP', vector: 'CAUTION', target: 5, weight: 'moderate', trackingType: 'cumulative' },

  // SOCIAL (8 behavements)
  { id: 'social_taunts', name: 'Provocateur', description: 'Taunt enemies 30 times', vector: 'SOCIAL', target: 30, weight: 'easy', trackingType: 'cumulative' },
  { id: 'social_taunts_100', name: 'Master Provocateur', description: 'Taunt enemies 100 times', vector: 'SOCIAL', target: 100, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'social_cha_growth', name: 'Charisma Training', description: 'Gain 500 CHA proficiency', vector: 'SOCIAL', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'social_cha_weapon_kills', name: 'Charismatic Fighter', description: 'Kill 50 enemies with CHA weapons', vector: 'SOCIAL', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'social_shop_visits', name: 'Regular Customer', description: 'Visit shops 15 times', vector: 'SOCIAL', target: 15, weight: 'easy', trackingType: 'cumulative' },
  { id: 'social_shrine_visits', name: 'Pious Adventurer', description: 'Visit shrines 10 times', vector: 'SOCIAL', target: 10, weight: 'easy', trackingType: 'cumulative' },
  { id: 'social_deity_favor_high', name: 'Favored Child', description: 'Reach 80+ deity favor', vector: 'SOCIAL', target: 80, weight: 'hard', trackingType: 'threshold' },
  { id: 'social_event_rooms', name: 'Story Seeker', description: 'Complete 20 event rooms', vector: 'SOCIAL', target: 20, weight: 'moderate', trackingType: 'cumulative' },

  // EXPLORATION (8 behavements)
  { id: 'explore_rooms_100', name: 'Explorer', description: 'Visit 100 rooms', vector: 'EXPLORATION', target: 100, weight: 'easy', trackingType: 'cumulative' },
  { id: 'explore_rooms_500', name: 'Cartographer', description: 'Visit 500 rooms', vector: 'EXPLORATION', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'explore_floors_10', name: 'Deep Delver', description: 'Reach floor 10', vector: 'EXPLORATION', target: 10, weight: 'moderate', trackingType: 'threshold' },
  { id: 'explore_floors_25', name: 'Abyssal Pioneer', description: 'Reach floor 25', vector: 'EXPLORATION', target: 25, weight: 'hard', trackingType: 'threshold' },
  { id: 'explore_treasure_rooms', name: 'Treasure Hunter', description: 'Find 15 treasure rooms', vector: 'EXPLORATION', target: 15, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'explore_per_growth', name: 'Perception Training', description: 'Gain 500 PER proficiency', vector: 'EXPLORATION', target: 500, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'explore_per_weapon_kills', name: 'Sharpshooter', description: 'Kill 50 enemies with PER weapons', vector: 'EXPLORATION', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'explore_secret_rooms', name: 'Secret Finder', description: 'Discover 5 secret rooms', vector: 'EXPLORATION', target: 5, weight: 'hard', trackingType: 'cumulative' },

  // RESOURCE (8 behavements)
  { id: 'resource_gold_1000', name: 'Coin Collector', description: 'Collect 1000 gold total', vector: 'RESOURCE', target: 1000, weight: 'easy', trackingType: 'cumulative' },
  { id: 'resource_gold_10000', name: 'Wealthy Adventurer', description: 'Collect 10000 gold total', vector: 'RESOURCE', target: 10000, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'resource_items_50', name: 'Item Hoarder', description: 'Collect 50 items', vector: 'RESOURCE', target: 50, weight: 'easy', trackingType: 'cumulative' },
  { id: 'resource_weapons_equip', name: 'Arms Dealer', description: 'Equip 25 different weapons', vector: 'RESOURCE', target: 25, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'resource_sell_items', name: 'Merchant', description: 'Sell 20 items', vector: 'RESOURCE', target: 20, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'resource_materials_collect', name: 'Material Gatherer', description: 'Collect 50 materials', vector: 'RESOURCE', target: 50, weight: 'moderate', trackingType: 'cumulative' },
  { id: 'resource_legendary_find', name: 'Legendary Finder', description: 'Find a legendary item', vector: 'RESOURCE', target: 1, weight: 'very_hard', trackingType: 'threshold' },
  { id: 'resource_str_growth', name: 'Strength Training', description: 'Gain 500 STR proficiency', vector: 'RESOURCE', target: 500, weight: 'moderate', trackingType: 'cumulative' },

  // GLORY (10 behavements - hard-path achievements)
  { id: 'glory_no_death_floor5', name: 'Deathless Descent', description: 'Reach floor 5 without dying', vector: 'GLORY', target: 5, weight: 'moderate', trackingType: 'threshold' },
  { id: 'glory_no_death_floor10', name: 'Immortal Journey', description: 'Reach floor 10 without dying', vector: 'GLORY', target: 10, weight: 'hard', trackingType: 'threshold' },
  { id: 'glory_boss_streak_3', name: 'Boss Hunter', description: 'Kill 3 bosses in one run', vector: 'GLORY', target: 3, weight: 'hard', trackingType: 'cumulative' },
  { id: 'glory_boss_streak_5', name: 'Boss Slayer Supreme', description: 'Kill 5 bosses in one run', vector: 'GLORY', target: 5, weight: 'very_hard', trackingType: 'cumulative' },
  { id: 'glory_legendary_achievement', name: 'Legendary Achiever', description: 'Complete a legendary achievement', vector: 'GLORY', target: 1, weight: 'very_hard', trackingType: 'threshold' },
  { id: 'glory_mythic_achievement', name: 'Mythic Achiever', description: 'Complete a mythic achievement', vector: 'GLORY', target: 1, weight: 'extreme', trackingType: 'threshold' },
  { id: 'glory_perfect_floor', name: 'Flawless Floor', description: 'Clear a floor taking no damage', vector: 'GLORY', target: 1, weight: 'very_hard', trackingType: 'threshold' },
  { id: 'glory_challenge_complete', name: 'God\'s Champion', description: 'Complete a deity challenge', vector: 'GLORY', target: 1, weight: 'hard', trackingType: 'threshold' },
  { id: 'glory_all_stats_c', name: 'Balanced Warrior', description: 'Get all stats to grade C', vector: 'GLORY', target: 1, weight: 'hard', trackingType: 'threshold' },
  { id: 'glory_level_10', name: 'Paragon Ascension', description: 'Reach level 10', vector: 'GLORY', target: 10, weight: 'legendary', trackingType: 'threshold' },
];

interface SoulState {
  // Denatus state (soul tracking)
  denatus: DenatusState | null;

  // Whether the Denatus ceremony has been performed
  ceremonyCompleted: boolean;

  // Actions - Initialization
  initializeDenatus: () => void;
  reset: () => void;

  // Actions - Behavement tracking
  trackBehavement: (behavementId: string, progress: number) => void;
  incrementBehavement: (behavementId: string, amount?: number) => void;
  setBehavementProgress: (behavementId: string, value: number) => void;
  checkConsecutiveBehavement: (behavementId: string, success: boolean) => void;

  // Actions - Vector scores
  recalculateVectorScores: () => void;

  // Actions - Denatus ceremony
  performDenatus: (topStats: [StatName, StatName]) => GeneratedTitle | null;

  // Actions - Hints
  addHint: (hint: DeityHint) => void;

  // Getters
  getBehavementProgress: (behavementId: string) => BehavementProgress | null;
  getCompletedBehavements: () => BehavementProgress[];
  getDominantVector: () => BehaviorVector | null;
  getVectorScore: (vector: BehaviorVector) => number;
  getOverallScore: () => number;
  getGeneratedTitle: () => GeneratedTitle | null;
  isCeremonyCompleted: () => boolean;
}

export const useSoulStore = create<SoulState>()(
  persist(
    (set, get) => ({
      denatus: null,
      ceremonyCompleted: false,

      // Initialization
      initializeDenatus: () => {
        const initialState = createInitialDenatusState();

        // Initialize behavement progress from definitions
        const behavements: BehavementProgress[] = BEHAVEMENT_DEFINITIONS.map((b) =>
          createBehavementProgress(b)
        );

        set({
          denatus: {
            ...initialState,
            behavements,
          },
          ceremonyCompleted: false,
        });
      },

      reset: () => {
        set({
          denatus: null,
          ceremonyCompleted: false,
        });
      },

      // Behavement tracking
      trackBehavement: (behavementId, progress) => {
        set((state) => {
          if (!state.denatus) return state;

          const behavementIndex = state.denatus.behavements.findIndex(
            (b) => b.behavementId === behavementId
          );
          if (behavementIndex === -1) return state;

          const behavement = state.denatus.behavements[behavementIndex];
          const newCurrent = Math.min(behavement.target, progress);
          const completed = newCurrent >= behavement.target;

          const newBehavements = [...state.denatus.behavements];
          newBehavements[behavementIndex] = {
            ...behavement,
            current: newCurrent,
            completed,
          };

          // Recalculate vector scores
          const newVectorScores = calculateVectorScores(newBehavements);

          return {
            denatus: {
              ...state.denatus,
              behavements: newBehavements,
              vectorScores: newVectorScores,
            },
          };
        });
      },

      incrementBehavement: (behavementId, amount = 1) => {
        const { denatus } = get();
        if (!denatus) return;

        const behavement = denatus.behavements.find((b) => b.behavementId === behavementId);
        if (!behavement) return;

        get().trackBehavement(behavementId, behavement.current + amount);
      },

      setBehavementProgress: (behavementId, value) => {
        get().trackBehavement(behavementId, value);
      },

      checkConsecutiveBehavement: (behavementId, success) => {
        set((state) => {
          if (!state.denatus) return state;

          const behavementIndex = state.denatus.behavements.findIndex(
            (b) => b.behavementId === behavementId
          );
          if (behavementIndex === -1) return state;

          const behavement = state.denatus.behavements[behavementIndex];

          // For consecutive tracking: reset on failure, increment on success
          let newCurrent: number;
          if (success) {
            newCurrent = Math.min(behavement.target, behavement.current + 1);
          } else {
            newCurrent = 0; // Reset streak on failure
          }

          const completed = newCurrent >= behavement.target;

          const newBehavements = [...state.denatus.behavements];
          newBehavements[behavementIndex] = {
            ...behavement,
            current: newCurrent,
            completed,
          };

          const newVectorScores = calculateVectorScores(newBehavements);

          return {
            denatus: {
              ...state.denatus,
              behavements: newBehavements,
              vectorScores: newVectorScores,
            },
          };
        });
      },

      // Vector scores
      recalculateVectorScores: () => {
        set((state) => {
          if (!state.denatus) return state;

          const newVectorScores = calculateVectorScores(state.denatus.behavements);

          return {
            denatus: {
              ...state.denatus,
              vectorScores: newVectorScores,
            },
          };
        });
      },

      // Denatus ceremony
      performDenatus: (topStats) => {
        const { denatus, ceremonyCompleted } = get();
        if (!denatus || ceremonyCompleted) return null;

        const title = generateParagonTitle(denatus.behavements, topStats);

        set((state) => ({
          denatus: state.denatus
            ? {
                ...state.denatus,
                lastCalculatedTitle: title,
              }
            : null,
          ceremonyCompleted: true,
        }));

        return title;
      },

      // Hints
      addHint: (hint) => {
        set((state) => {
          if (!state.denatus) return state;

          // Keep last 20 hints
          const newHistory = [...state.denatus.hintHistory, hint].slice(-20);

          return {
            denatus: {
              ...state.denatus,
              hintHistory: newHistory,
            },
          };
        });
      },

      // Getters
      getBehavementProgress: (behavementId) => {
        const { denatus } = get();
        if (!denatus) return null;

        return denatus.behavements.find((b) => b.behavementId === behavementId) ?? null;
      },

      getCompletedBehavements: () => {
        const { denatus } = get();
        if (!denatus) return [];

        return denatus.behavements.filter((b) => b.completed);
      },

      getDominantVector: () => {
        const { denatus } = get();
        if (!denatus) return null;

        return getDominantVector(denatus.vectorScores);
      },

      getVectorScore: (vector) => {
        const { denatus } = get();
        if (!denatus) return 0;

        return denatus.vectorScores[vector] ?? 0;
      },

      getOverallScore: () => {
        const { denatus } = get();
        if (!denatus) return 0;

        return calculateBehavementScore(denatus.behavements);
      },

      getGeneratedTitle: () => {
        const { denatus } = get();
        return denatus?.lastCalculatedTitle ?? null;
      },

      isCeremonyCompleted: () => {
        return get().ceremonyCompleted;
      },
    }),
    {
      name: 'kohrvellia-soul',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Export behavement definitions for reference
export { BEHAVEMENT_DEFINITIONS };
