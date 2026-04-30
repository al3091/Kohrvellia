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
import { useCharacterStore } from './useCharacterStore';

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
  /** Accept a challenge by id; floorsToComplete sets the floor countdown */
  issueChallenge: (challengeId: string, floorsToComplete: number) => void;
  /** Increment current challenge progress by amount (for kill-type challenges) */
  updateChallengeProgress: (amount: number) => void;
  /** Call when the player descends a floor — fails challenge if out of floors */
  checkChallengeExpiry: (currentFloor: number) => void;
  completeChallenge: () => void;
  failChallenge: () => void;
  /** Fail and clear current challenge (alias kept for semantic clarity in UI) */
  abandonChallenge: () => void;
  tickChallengeFloor: () => void;
  /** Auto-complete challenge if progress meets the requirement */
  checkChallengeCompletion: () => void;

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

      issueChallenge: (challengeId, floorsToComplete) => {
        set((state) => {
          if (!state.relationship) return state;

          return {
            relationship: {
              ...state.relationship,
              currentChallenge: {
                challengeId,
                progress: 0,
                floorsRemaining: floorsToComplete,
                startedAt: Date.now(),
              },
            },
          };
        });
      },

      updateChallengeProgress: (amount) => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          const newProgress = state.relationship.currentChallenge.progress + amount;

          return {
            relationship: {
              ...state.relationship,
              currentChallenge: {
                ...state.relationship.currentChallenge,
                progress: newProgress,
              },
            },
          };
        });

        // Auto-complete after updating progress
        get().checkChallengeCompletion();
      },

      checkChallengeExpiry: (_currentFloor) => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;
          const { floorsRemaining } = state.relationship.currentChallenge;
          if (floorsRemaining === undefined) return state;

          const newFloorsRemaining = floorsRemaining - 1;

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

      checkChallengeCompletion: () => {
        const state = get();
        if (!state.relationship?.currentChallenge) return;

        const { challengeId, progress } = state.relationship.currentChallenge;
        const deity = state.getPatronDeity();
        if (!deity) return;

        const challenge = deity.challenges.find((c) => c.id === challengeId);
        if (!challenge) return;

        if (progress >= challenge.requirement.value) {
          get().completeChallenge();
        }
      },

      completeChallenge: () => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          const { challengeId } = state.relationship.currentChallenge;
          const deity = getDeityById(state.relationship.deityId);
          const challenge = deity?.challenges.find((c) => c.id === challengeId);

          // Use challenge-specific favorGain when available, fall back to default
          const favorGain = challenge?.favorGain ?? calculateFavorChange('challenge_complete');

          return {
            relationship: {
              ...state.relationship,
              favor: Math.min(100, state.relationship.favor + favorGain),
              challengesCompleted: state.relationship.challengesCompleted + 1,
              currentChallenge: undefined,
            },
            completedChallengeIds: [...state.completedChallengeIds, challengeId],
          };
        });

        // Award bonus stat points via pending excelia if the challenge grants them
        const { relationship } = get();
        // relationship.currentChallenge is already cleared — look up challenge from completedChallengeIds
        // We need the challenge object; fetch the deity's challenges and find the recently completed one
        const updatedState = get();
        const deity = updatedState.getPatronDeity();
        if (deity) {
          const lastCompleted = updatedState.completedChallengeIds[updatedState.completedChallengeIds.length - 1];
          const challenge = deity.challenges.find((c) => c.id === lastCompleted);
          if (challenge?.bonusStatPoints && challenge.bonusStatPoints > 0) {
            const pointsPerStat = Math.max(1, Math.floor(challenge.bonusStatPoints / 4));
            const characterStore = useCharacterStore.getState();
            characterStore.addPendingExcelia('STR', pointsPerStat);
            characterStore.addPendingExcelia('END', pointsPerStat);
            characterStore.addPendingExcelia('AGI', pointsPerStat);
            characterStore.addPendingExcelia('PER', pointsPerStat);
          }
        }
        void relationship; // suppress unused warning
      },

      failChallenge: () => {
        set((state) => {
          if (!state.relationship?.currentChallenge) return state;

          const { challengeId } = state.relationship.currentChallenge;
          const deity = getDeityById(state.relationship.deityId);
          const challenge = deity?.challenges.find((c) => c.id === challengeId);

          // Use challenge-specific favorLoss when available, fall back to default
          const favorLoss = challenge?.favorLoss ?? Math.abs(calculateFavorChange('challenge_fail'));

          return {
            relationship: {
              ...state.relationship,
              favor: Math.max(0, state.relationship.favor - favorLoss),
              challengesFailed: state.relationship.challengesFailed + 1,
              currentChallenge: undefined,
            },
          };
        });
      },

      abandonChallenge: () => {
        get().failChallenge();
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
