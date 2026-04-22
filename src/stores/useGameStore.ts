/**
 * Game meta state store using Zustand
 * Manages settings, save/load, and meta-progression
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSoulStore } from './useSoulStore';

// Game phases/screens
export type GamePhase =
  | 'title' // Title screen
  | 'new_game' // Character creation
  | 'deity_selection' // Choosing patron deity
  | 'tutorial' // First-time tutorial
  | 'town' // Safe zone
  | 'dungeon' // In the tower
  | 'combat' // Active combat
  | 'event' // Event/narrative screen
  | 'level_up' // Level up ceremony
  | 'death' // Death screen
  | 'paragon'; // Paragon evolution (level 10)

// Settings
export interface GameSettings {
  // Audio
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  haptics: boolean;

  // Display
  textSize: 'small' | 'medium' | 'large';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  showDamageNumbers: boolean;
  showCRWarnings: boolean;

  // Gameplay
  confirmActions: boolean; // Confirm before dangerous actions
  autoSave: boolean;
  speedUpAnimations: boolean;
}

// Run record (for epitaph/history)
export interface RunRecord {
  id: string;
  characterName: string;
  epithet: string;
  backstory: string;
  patronDeity: string;
  finalLevel: number;
  deepestFloor: number;
  causeOfDeath: string;
  monstersKilled: number;
  goldEarned: number;
  playTimeSeconds: number;
  endedAt: number;
}

// Achievement unlock record (meta-progression)
export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: number;
  runId: string;
}

// Deity unlock record
export interface UnlockedDeity {
  deityId: string;
  unlockedAt: number;
}

// Monster knowledge tiers: unknown → sighted → studied → mastered
export type MonsterKnowledgeTier = 'unknown' | 'sighted' | 'studied' | 'mastered';

export interface MonsterKnowledgeRecord {
  baseId: string;
  encounterCount: number;
  observeCount: number;
  tier: MonsterKnowledgeTier;
}

interface GameState {
  // Current phase
  currentPhase: GamePhase;

  // Settings
  settings: GameSettings;

  // Meta-progression (persists across runs)
  runHistory: RunRecord[];
  totalRuns: number;
  totalDeaths: number;
  bestFloorReached: number;
  unlockedAchievements: UnlockedAchievement[];
  unlockedDeities: UnlockedDeity[];
  codexEntries: string[]; // Monster/item IDs discovered
  monsterKnowledge: Record<string, MonsterKnowledgeRecord>; // Persistent bestiary data

  // Tutorial state
  hasCompletedTutorial: boolean;
  hasSkippedTutorial: boolean;
  tutorialStep: number;

  // First combat protection
  hasHadFirstCombat: boolean;

  // Actions - Phase
  setPhase: (phase: GamePhase) => void;

  // Actions - Settings
  updateSettings: (updates: Partial<GameSettings>) => void;
  resetSettings: () => void;

  // Actions - Meta-progression
  recordRunEnd: (record: RunRecord) => void;
  unlockAchievement: (achievementId: string, runId: string) => void;
  unlockDeity: (deityId: string) => void;
  addCodexEntry: (entryId: string) => void;
  recordMonsterEncounter: (baseId: string) => void;
  addMonsterObservation: (baseId: string) => void;

  // Actions - Tutorial
  completeTutorial: () => void;
  skipTutorial: () => void;
  advanceTutorial: () => void;
  resetTutorial: () => void;

  // Actions - First combat
  setHasHadFirstCombat: () => void;

  // Computed
  isDeityUnlocked: (deityId: string) => boolean;
  isAchievementUnlocked: (achievementId: string) => boolean;
  hasCodexEntry: (entryId: string) => boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 70,
  sfxVolume: 80,
  haptics: true,
  textSize: 'medium',
  colorBlindMode: 'none',
  showDamageNumbers: true,
  showCRWarnings: true,
  confirmActions: true,
  autoSave: true,
  speedUpAnimations: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPhase: 'title',
      settings: { ...DEFAULT_SETTINGS },
      runHistory: [],
      totalRuns: 0,
      totalDeaths: 0,
      bestFloorReached: 0,
      unlockedAchievements: [],
      unlockedDeities: [],
      codexEntries: [],
      monsterKnowledge: {},
      hasCompletedTutorial: false,
      hasSkippedTutorial: false,
      tutorialStep: 0,
      hasHadFirstCombat: false,

      // Phase
      setPhase: (phase) => {
        set({ currentPhase: phase });
      },

      // Settings
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS } });
      },

      // Meta-progression
      recordRunEnd: (record) => {
        set((state) => {
          const newHistory = [record, ...state.runHistory].slice(0, 100); // Keep last 100 runs

          return {
            runHistory: newHistory,
            totalRuns: state.totalRuns + 1,
            totalDeaths: state.totalDeaths + (record.causeOfDeath !== 'return' ? 1 : 0),
            bestFloorReached: Math.max(state.bestFloorReached, record.deepestFloor),
          };
        });
      },

      unlockAchievement: (achievementId, runId) => {
        set((state) => {
          // Check if already unlocked
          if (state.unlockedAchievements.some((a) => a.achievementId === achievementId)) {
            return state;
          }

          return {
            unlockedAchievements: [
              ...state.unlockedAchievements,
              {
                achievementId,
                unlockedAt: Date.now(),
                runId,
              },
            ],
          };
        });
      },

      unlockDeity: (deityId) => {
        set((state) => {
          // Check if already unlocked
          if (state.unlockedDeities.some((d) => d.deityId === deityId)) {
            return state;
          }

          return {
            unlockedDeities: [
              ...state.unlockedDeities,
              {
                deityId,
                unlockedAt: Date.now(),
              },
            ],
          };
        });
      },

      addCodexEntry: (entryId) => {
        set((state) => {
          if (state.codexEntries.includes(entryId)) {
            return state;
          }

          return {
            codexEntries: [...state.codexEntries, entryId],
          };
        });
      },

      recordMonsterEncounter: (baseId) => {
        set((state) => {
          const existing = state.monsterKnowledge[baseId];
          const encounterCount = (existing?.encounterCount ?? 0) + 1;
          const observeCount = existing?.observeCount ?? 0;
          const tier: MonsterKnowledgeTier =
            observeCount >= 3 ? 'mastered' :
            observeCount >= 1 ? 'studied' :
            encounterCount >= 1 ? 'sighted' : 'unknown';
          return {
            monsterKnowledge: {
              ...state.monsterKnowledge,
              [baseId]: { baseId, encounterCount, observeCount, tier },
            },
          };
        });
      },

      addMonsterObservation: (baseId) => {
        set((state) => {
          const existing = state.monsterKnowledge[baseId];
          const encounterCount = existing?.encounterCount ?? 1;
          const observeCount = (existing?.observeCount ?? 0) + 1;
          const tier: MonsterKnowledgeTier =
            observeCount >= 3 ? 'mastered' :
            observeCount >= 1 ? 'studied' :
            encounterCount >= 1 ? 'sighted' : 'unknown';
          return {
            monsterKnowledge: {
              ...state.monsterKnowledge,
              [baseId]: { baseId, encounterCount, observeCount, tier },
            },
          };
        });
      },

      // First combat
      setHasHadFirstCombat: () => {
        set({ hasHadFirstCombat: true });
      },

      // Tutorial
      completeTutorial: () => {
        set({ hasCompletedTutorial: true });
        if (!useSoulStore.getState().denatus) {
          useSoulStore.getState().initializeDenatus();
        }
      },

      skipTutorial: () => {
        set({ hasSkippedTutorial: true, hasCompletedTutorial: true });
        if (!useSoulStore.getState().denatus) {
          useSoulStore.getState().initializeDenatus();
        }
      },

      advanceTutorial: () => {
        set((state) => ({ tutorialStep: state.tutorialStep + 1 }));
      },

      resetTutorial: () => {
        set({ hasCompletedTutorial: false, tutorialStep: 0 });
      },

      // Computed
      isDeityUnlocked: (deityId) => {
        const { unlockedDeities } = get();
        // Some deities are unlocked by default
        const defaultUnlocked = [
          'zeus', 'odin', 'ra', 'amaterasu', // One per starting pantheon
        ];
        return defaultUnlocked.includes(deityId) || unlockedDeities.some((d) => d.deityId === deityId);
      },

      isAchievementUnlocked: (achievementId) => {
        const { unlockedAchievements } = get();
        return unlockedAchievements.some((a) => a.achievementId === achievementId);
      },

      hasCodexEntry: (entryId) => {
        const { codexEntries } = get();
        return codexEntries.includes(entryId);
      },
    }),
    {
      name: 'kohrvellia-game',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
