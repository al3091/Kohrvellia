/**
 * Deity relationship state store using Zustand
 * Manages patron deity favor, blessings, and challenges
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Deity, DeityRelationship, GodChallenge, DeityDomain } from '../types/Deity';
import {
  createDeityRelationship,
  calculateBlessingPower,
  isAbilityUnlocked,
  getAvailableChallenges,
  calculateFavorChange,
  DOMAIN_EFFECTS,
} from '../types/Deity';
import { getDeityById } from '../data/pantheons';

// Favor status thresholds
export const FAVOR_STATUS = {
  ABANDONED: { min: 0, max: 10, label: 'Abandoned', multiplier: 0 },
  DISFAVORED: { min: 11, max: 25, label: 'Disfavored', multiplier: 0.5 },
  TOLERATED: { min: 26, max: 40, label: 'Tolerated', multiplier: 0.75 },
  ACCEPTED: { min: 41, max: 60, label: 'Accepted', multiplier: 1.0 },
  FAVORED: { min: 61, max: 75, label: 'Favored', multiplier: 1.25 },
  BLESSED: { min: 76, max: 90, label: 'Blessed', multiplier: 1.5 },
  FAVOURED_CHILD: { min: 91, max: 100, label: 'Favoured Child', multiplier: 2.0 },
} as const;

type FavorStatus = keyof typeof FAVOR_STATUS;

interface DeityState {
  // Relationship with current patron
  relationship: DeityRelationship | null;

  // Completed challenge IDs (persists across sessions)
  completedChallengeIds: string[];

  // Actions - Setup
  setPatronDeity: (deityId: string) => void;
  clearPatronDeity: () => void;

  // Actions - Favor
  adjustFavor: (amount: number, reason: string) => void;
  performDomainAction: (domain: DeityDomain) => void;

  // Actions - Challenges
  startChallenge: (challenge: GodChallenge) => void;
  updateChallengeProgress: (progress: number) => void;
  completeChallenge: () => void;
  failChallenge: () => void;
  tickChallengeFloor: () => void;

  // Actions - Hints
  recordHint: (hint: string, triggerType: string) => void;

  // Getters
  getPatronDeity: () => Deity | null;
  getFavorStatus: () => FavorStatus;
  getBlessingMultiplier: () => number;
  getBlessingEffect: () => { type: string; value: number; description: string } | null;
  isAbilityUnlocked: () => boolean;
  getAvailableChallenges: () => GodChallenge[];
  hasActiveChallenge: () => boolean;
}

export const useDeityStore = create<DeityState>()(
  persist(
    (set, get) => ({
      relationship: null,
      completedChallengeIds: [],

      // Setup
      setPatronDeity: (deityId) => {
        const newRelationship = createDeityRelationship(deityId);
        set({ relationship: newRelationship });
      },

      clearPatronDeity: () => {
        set({ relationship: null });
      },

      // Favor
      adjustFavor: (amount, _reason) => {
        set((state) => {
          if (!state.relationship) return state;

          const newFavor = Math.max(0, Math.min(100, state.relationship.favor + amount));

          return {
            relationship: {
              ...state.relationship,
              favor: newFavor,
            },
          };
        });
      },

      performDomainAction: (domain) => {
        const { relationship } = get();
        if (!relationship) return;

        const deity = getDeityById(relationship.deityId);
        if (!deity) return;

        // Check if action matches deity's domain
        if (deity.domain === domain) {
          const favorChange = calculateFavorChange('domain_action');
          get().adjustFavor(favorChange, `Domain action: ${domain}`);
        }
      },

      // Challenges
      startChallenge: (challenge) => {
        set((state) => {
          if (!state.relationship) return state;

          return {
            relationship: {
              ...state.relationship,
              currentChallenge: {
                challengeId: challenge.id,
                progress: 0,
                floorsRemaining: challenge.requirement.timeLimit,
                startedAt: Date.now(),
              },
            },
          };
        });
      },

      updateChallengeProgress: (progress) => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          return {
            relationship: {
              ...state.relationship,
              currentChallenge: {
                ...state.relationship.currentChallenge,
                progress,
              },
            },
          };
        });
      },

      completeChallenge: () => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          const challengeId = state.relationship.currentChallenge.challengeId;
          const favorChange = calculateFavorChange('challenge_complete');

          return {
            relationship: {
              ...state.relationship,
              favor: Math.min(100, state.relationship.favor + favorChange),
              challengesCompleted: state.relationship.challengesCompleted + 1,
              currentChallenge: undefined,
            },
            completedChallengeIds: [...state.completedChallengeIds, challengeId],
          };
        });
      },

      failChallenge: () => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          const favorChange = calculateFavorChange('challenge_fail');

          return {
            relationship: {
              ...state.relationship,
              favor: Math.max(0, state.relationship.favor + favorChange),
              challengesFailed: state.relationship.challengesFailed + 1,
              currentChallenge: undefined,
            },
          };
        });
      },

      tickChallengeFloor: () => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;
          if (state.relationship.currentChallenge.floorsRemaining === undefined) return state;

          const newFloorsRemaining = state.relationship.currentChallenge.floorsRemaining - 1;

          // Auto-fail if out of floors
          if (newFloorsRemaining <= 0) {
            const favorChange = calculateFavorChange('challenge_fail');
            return {
              relationship: {
                ...state.relationship,
                favor: Math.max(0, state.relationship.favor + favorChange),
                challengesFailed: state.relationship.challengesFailed + 1,
                currentChallenge: undefined,
              },
            };
          }

          return {
            relationship: {
              ...state.relationship,
              currentChallenge: {
                ...state.relationship.currentChallenge,
                floorsRemaining: newFloorsRemaining,
              },
            },
          };
        });
      },

      // Hints
      recordHint: (hint, triggerType) => {
        set((state) => {
          if (!state.relationship) return state;

          const newHint = {
            hint,
            timestamp: Date.now(),
            triggerType,
          };

          // Keep last 20 hints
          const newHistory = [...state.relationship.hintHistory, newHint].slice(-20);

          return {
            relationship: {
              ...state.relationship,
              hintHistory: newHistory,
            },
          };
        });
      },

      // Getters
      getPatronDeity: () => {
        const { relationship } = get();
        if (!relationship) return null;
        return getDeityById(relationship.deityId) || null;
      },

      getFavorStatus: () => {
        const { relationship } = get();
        if (!relationship) return 'ABANDONED';

        const favor = relationship.favor;

        for (const [status, range] of Object.entries(FAVOR_STATUS)) {
          if (favor >= range.min && favor <= range.max) {
            return status as FavorStatus;
          }
        }

        return 'ACCEPTED';
      },

      getBlessingMultiplier: () => {
        const status = get().getFavorStatus();
        return FAVOR_STATUS[status].multiplier;
      },

      getBlessingEffect: () => {
        const deity = get().getPatronDeity();
        if (!deity) return null;

        get().getBlessingMultiplier();
        const domainEffect = DOMAIN_EFFECTS[deity.domain];

        return {
          type: deity.domain,
          value: calculateBlessingPower(deity.domainBlessing.effectValue, get().relationship?.favor || 50),
          description: domainEffect?.primaryEffect || deity.domainBlessing.description,
        };
      },

      isAbilityUnlocked: () => {
        const { relationship } = get();
        const deity = get().getPatronDeity();

        if (!relationship || !deity) return false;

        return isAbilityUnlocked(deity.uniqueAbility, relationship.favor);
      },

      getAvailableChallenges: () => {
        const { relationship, completedChallengeIds } = get();
        const deity = get().getPatronDeity();

        if (!relationship || !deity) return [];

        return getAvailableChallenges(deity, relationship.favor, completedChallengeIds);
      },

      hasActiveChallenge: () => {
        const { relationship } = get();
        return !!relationship?.currentChallenge;
      },
    }),
    {
      name: 'kohrvellia-deity',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
