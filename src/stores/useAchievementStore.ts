/**
 * Achievement state store using Zustand
 * Tracks achievement progress and handles level-up ceremonies
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Achievement,
  AchievementProgress,
  AchievementTier,
  DiscoveryState,
  RequirementType,
} from '../types/Achievement';
import {
  createAchievementProgress,
  isRequirementMet,
  ACHIEVEMENT_TIER_REWARDS,
} from '../types/Achievement';
import { ALL_ACHIEVEMENTS } from '../data/achievements';

interface AchievementState {
  // Progress tracking for all achievements
  progress: Record<string, AchievementProgress>;

  // Currently available achievements for level-up
  availableForLevelUp: string[];

  // Selected achievements for current level-up ceremony
  selectedForLevelUp: string[];

  // Level-up ceremony state
  isInCeremony: boolean;
  ceremonyLevel: number; // The level being achieved

  // Actions
  initializeProgress: () => void;
  updateProgress: (type: RequirementType, value: number, targetType?: string) => void;
  incrementProgress: (type: RequirementType, amount: number, targetType?: string) => void;
  checkCompletion: (achievementId: string) => boolean;
  discoverAchievement: (achievementId: string, source: string) => void;
  discoverAllFromSource: (source: string) => void;

  // Level-up ceremony
  startLevelUpCeremony: (targetLevel: number) => void;
  selectAchievement: (achievementId: string) => void;
  deselectAchievement: (achievementId: string) => void;
  completeLevelUp: () => { bonusPoints: number; gloryPoints: number; titles: string[] };
  cancelCeremony: () => void;

  // Queries
  getAchievement: (id: string) => Achievement | undefined;
  getProgress: (id: string) => AchievementProgress | undefined;
  getCompletedAchievements: (targetLevel?: number) => Achievement[];
  getAvailableAchievements: (targetLevel: number) => Achievement[];
  getTierCount: (targetLevel: number) => Record<AchievementTier, number>;
  getDiscoveryStateForLevel: (targetLevel: number) => Record<string, DiscoveryState>;

  // Reset for new game
  resetAllProgress: () => void;
  unlockAchievementsForLevel: (targetLevel: number) => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      progress: {},
      availableForLevelUp: [],
      selectedForLevelUp: [],
      isInCeremony: false,
      ceremonyLevel: 0,

      initializeProgress: () => {
        const existingProgress = get().progress;
        const newProgress: Record<string, AchievementProgress> = { ...existingProgress };

        // Initialize progress for all achievements that don't have tracking yet.
        // Guild-source achievements start as 'rumored' — the Guild Hall passively
        // spreads basic knowledge. All others start 'hidden'.
        for (const achievement of ALL_ACHIEVEMENTS) {
          if (!newProgress[achievement.id]) {
            const baseProgress = createAchievementProgress(achievement, false);
            if (achievement.discoverySource === 'guild') {
              baseProgress.discoveryState = 'rumored';
            }
            newProgress[achievement.id] = baseProgress;
          }
        }

        set({ progress: newProgress });
      },

      updateProgress: (type, value, targetType) => {
        const { progress } = get();
        const updatedProgress = { ...progress };

        for (const achievement of ALL_ACHIEVEMENTS) {
          const achievementProgress = updatedProgress[achievement.id];
          if (!achievementProgress || achievementProgress.isCompleted) continue;
          if (achievementProgress.discoveryState === 'hidden') continue;

          // Update each matching requirement
          for (let i = 0; i < achievement.requirements.length; i++) {
            const req = achievement.requirements[i];
            if (req.type !== type) continue;
            if (req.targetType && req.targetType !== targetType) continue;

            const reqProgress = achievementProgress.requirementProgress[i];
            if (!reqProgress) continue;

            // Set the value (for absolute tracking like floor_reach)
            reqProgress.current = Math.max(reqProgress.current, value);
            reqProgress.completed = isRequirementMet(req, reqProgress.current);
          }

          // Check if achievement is now complete
          const allComplete = achievement.requireAll
            ? achievementProgress.requirementProgress.every(r => r.completed)
            : achievementProgress.requirementProgress.some(r => r.completed);

          if (allComplete && !achievementProgress.isCompleted) {
            achievementProgress.isCompleted = true;
            achievementProgress.completedAt = Date.now();
          }
        }

        set({ progress: updatedProgress });
      },

      incrementProgress: (type, amount, targetType) => {
        const { progress } = get();
        const updatedProgress = { ...progress };

        for (const achievement of ALL_ACHIEVEMENTS) {
          const achievementProgress = updatedProgress[achievement.id];
          if (!achievementProgress || achievementProgress.isCompleted) continue;
          if (achievementProgress.discoveryState === 'hidden') continue;

          // Update each matching requirement
          for (let i = 0; i < achievement.requirements.length; i++) {
            const req = achievement.requirements[i];
            if (req.type !== type) continue;
            if (req.targetType && req.targetType !== targetType) continue;

            const reqProgress = achievementProgress.requirementProgress[i];
            if (!reqProgress) continue;

            // Increment the value (for cumulative tracking like kill_count)
            reqProgress.current += amount;
            reqProgress.completed = isRequirementMet(req, reqProgress.current);
          }

          // Check if achievement is now complete
          const allComplete = achievement.requireAll
            ? achievementProgress.requirementProgress.every(r => r.completed)
            : achievementProgress.requirementProgress.some(r => r.completed);

          if (allComplete && !achievementProgress.isCompleted) {
            achievementProgress.isCompleted = true;
            achievementProgress.completedAt = Date.now();
          }
        }

        set({ progress: updatedProgress });
      },

      checkCompletion: (achievementId) => {
        const progress = get().progress[achievementId];
        return progress?.isCompleted ?? false;
      },

      discoverAchievement: (achievementId, source) => {
        const { progress } = get();
        const achievementProgress = progress[achievementId];

        if (!achievementProgress) return;
        // Already known or completed — nothing to do
        if (
          achievementProgress.discoveryState === 'known' ||
          achievementProgress.discoveryState === 'completed'
        ) return;

        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        // Source must match the achievement's discoverySource
        if (achievement.discoverySource !== source) return;

        // hidden → rumored, or rumored → known
        const nextState: DiscoveryState =
          achievementProgress.discoveryState === 'hidden' ? 'rumored' : 'known';

        set({
          progress: {
            ...progress,
            [achievementId]: {
              ...achievementProgress,
              discoveryState: nextState,
            },
          },
        });
      },

      discoverAllFromSource: (source) => {
        const { progress } = get();
        const updatedProgress = { ...progress };
        let changed = false;

        for (const achievement of ALL_ACHIEVEMENTS) {
          if (achievement.discoverySource !== source) continue;

          const p = updatedProgress[achievement.id];
          if (!p) continue;
          if (p.discoveryState === 'known' || p.discoveryState === 'completed') continue;

          const nextState: DiscoveryState =
            p.discoveryState === 'hidden' ? 'rumored' : 'known';

          updatedProgress[achievement.id] = { ...p, discoveryState: nextState };
          changed = true;
        }

        if (changed) {
          set({ progress: updatedProgress });
        }
      },

      // Level-up ceremony
      startLevelUpCeremony: (targetLevel) => {
        const completed = get().getCompletedAchievements(targetLevel);
        const unusedCompleted = completed.filter(a => {
          const prog = get().progress[a.id];
          return prog && !prog.usedForLevelUp;
        });

        set({
          isInCeremony: true,
          ceremonyLevel: targetLevel,
          availableForLevelUp: unusedCompleted.map(a => a.id),
          selectedForLevelUp: [],
        });
      },

      selectAchievement: (achievementId) => {
        const { selectedForLevelUp, availableForLevelUp } = get();

        // Can only select up to 3 achievements
        if (selectedForLevelUp.length >= 3) return;
        if (!availableForLevelUp.includes(achievementId)) return;
        if (selectedForLevelUp.includes(achievementId)) return;

        set({ selectedForLevelUp: [...selectedForLevelUp, achievementId] });
      },

      deselectAchievement: (achievementId) => {
        const { selectedForLevelUp } = get();
        set({
          selectedForLevelUp: selectedForLevelUp.filter(id => id !== achievementId),
        });
      },

      completeLevelUp: () => {
        const { selectedForLevelUp, progress, ceremonyLevel } = get();

        if (selectedForLevelUp.length === 0) {
          return { bonusPoints: 0, gloryPoints: 0, titles: [] };
        }

        // Calculate rewards
        let bonusPoints = 0;
        let gloryPoints = 0;
        const titles: string[] = [];

        const updatedProgress = { ...progress };

        for (const achievementId of selectedForLevelUp) {
          const achievement = get().getAchievement(achievementId);
          if (!achievement) continue;

          const tierRewards = ACHIEVEMENT_TIER_REWARDS[achievement.tier];
          bonusPoints += tierRewards.bonusStatPoints;
          gloryPoints += tierRewards.gloryPoints;

          if (achievement.titleModifier) {
            titles.push(achievement.titleModifier);
          }

          // Mark as used for level-up
          if (updatedProgress[achievementId]) {
            updatedProgress[achievementId] = {
              ...updatedProgress[achievementId],
              usedForLevelUp: true,
              levelUsedAt: ceremonyLevel,
            };
          }
        }

        // Apply stacking bonus for multiple achievements
        if (selectedForLevelUp.length >= 2) {
          bonusPoints = Math.floor(bonusPoints * 1.25);
        }
        if (selectedForLevelUp.length >= 3) {
          bonusPoints = Math.floor(bonusPoints * 1.2); // Additional 20%
        }

        set({
          progress: updatedProgress,
          isInCeremony: false,
          ceremonyLevel: 0,
          availableForLevelUp: [],
          selectedForLevelUp: [],
        });

        return { bonusPoints, gloryPoints, titles };
      },

      cancelCeremony: () => {
        set({
          isInCeremony: false,
          ceremonyLevel: 0,
          availableForLevelUp: [],
          selectedForLevelUp: [],
        });
      },

      // Queries
      getAchievement: (id) => {
        return ALL_ACHIEVEMENTS.find(a => a.id === id);
      },

      getProgress: (id) => {
        return get().progress[id];
      },

      getCompletedAchievements: (targetLevel) => {
        const { progress } = get();
        return ALL_ACHIEVEMENTS.filter(a => {
          if (targetLevel !== undefined && a.targetLevel !== targetLevel) return false;
          const prog = progress[a.id];
          return prog?.isCompleted ?? false;
        });
      },

      getAvailableAchievements: (targetLevel) => {
        const { progress } = get();
        return ALL_ACHIEVEMENTS.filter(a => {
          if (a.targetLevel !== targetLevel) return false;
          const prog = progress[a.id];
          // Show if discovered (known or completed)
          return prog?.discoveryState === 'known' || prog?.discoveryState === 'completed';
        });
      },

      getTierCount: (targetLevel) => {
        const completed = get().getCompletedAchievements(targetLevel);
        const counts: Record<AchievementTier, number> = {
          standard: 0,
          challenging: 0,
          heroic: 0,
          legendary: 0,
          mythic: 0,
        };

        for (const a of completed) {
          const prog = get().progress[a.id];
          if (prog && !prog.usedForLevelUp) {
            counts[a.tier]++;
          }
        }

        return counts;
      },

      getDiscoveryStateForLevel: (targetLevel) => {
        const { progress } = get();
        const result: Record<string, DiscoveryState> = {};

        for (const achievement of ALL_ACHIEVEMENTS) {
          if (achievement.targetLevel !== targetLevel) continue;
          const p = progress[achievement.id];
          result[achievement.id] = p?.discoveryState ?? 'hidden';
        }

        return result;
      },

      // Reset all progress for new game
      resetAllProgress: () => {
        set({
          progress: {},
          availableForLevelUp: [],
          selectedForLevelUp: [],
          isInCeremony: false,
          ceremonyLevel: 0,
        });
      },

      unlockAchievementsForLevel: (targetLevel) => {
        const { progress } = get();
        const updatedProgress = { ...progress };

        for (const achievement of ALL_ACHIEVEMENTS) {
          if (achievement.targetLevel !== targetLevel) continue;
          if (achievement.tier !== 'standard') continue;
          const p = updatedProgress[achievement.id];
          if (p && p.discoveryState === 'hidden') {
            updatedProgress[achievement.id] = { ...p, discoveryState: 'known' };
          }
        }

        set({ progress: updatedProgress });
      },
    }),
    {
      name: 'kohrvellia-achievements',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
