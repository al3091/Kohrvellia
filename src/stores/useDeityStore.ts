/**
 * Deity relationship state store using Zustand
 * Manages patron deity favor, blessings, and challenges
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createVersionedPersist } from '../lib/createVersionedPersist';

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
import type { StatName } from '../types/Stats';
import { useSoulStore } from './useSoulStore';
import { useSacredItemStore } from './useSacredItemStore';

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

export const EVICTION_MESSAGES = {
  abandoned: (deityName: string) =>
    `${deityName} has gone silent. The mark on your back grows cold — then fades. They did not say goodbye. Gods who speak at the end leave evidence.`,
  disfavored: (deityName: string) =>
    `${deityName} watches, but from further away now. The thread is thin.`,
} as const;

type FavorStatus = keyof typeof FAVOR_STATUS;

interface DeityState {
  // Relationship with current patron
  relationship: DeityRelationship | null;

  // Completed challenge IDs (persists across sessions)
  completedChallengeIds: string[];

  // Pending reward to show in Familia Home after a challenge completes mid-dungeon
  pendingChallengeReward: { challengeName: string; favorGain: number; bonusStatPoints: number } | null;

  // Set when favor drops to ABANDONED — triggers eviction modal in Familia Home
  isPatronEvicted: boolean;

  // Actions - Setup
  setPatronDeity: (deityId: string) => void;
  clearPatronDeity: () => void;
  reset: () => void;

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
  /** Route a game event to challenge progress if the active challenge matches the event type */
  recordChallengeEvent: (eventType: string, amount?: number) => void;
  /** Dismiss and clear the pending challenge reward notification */
  claimChallengeReward: () => void;
  /** Execute eviction: clear patron relationship */
  evictPatron: () => void;
}

export const useDeityStore = create<DeityState>()(
  persist(
    (set, get) => ({
      relationship: null,
      completedChallengeIds: [],
      pendingChallengeReward: null,
      isPatronEvicted: false,

      // Setup
      setPatronDeity: (deityId) => {
        const newRelationship = createDeityRelationship(deityId);
        set({ relationship: newRelationship });
      },

      clearPatronDeity: () => {
        set({ relationship: null });
      },

      reset: () => {
        // KV-AUD-124 (B-03): a new character must not inherit a dead one's stale
        // eviction flag or pending challenge-reward popup.
        set({
          relationship: null,
          completedChallengeIds: [],
          pendingChallengeReward: null,
          isPatronEvicted: false,
        });
      },

      // Favor
      adjustFavor: (amount, _reason) => {
        set((state) => {
          if (!state.relationship) return state;
          const newFavor = Math.max(0, Math.min(100, state.relationship.favor + amount));
          return { relationship: { ...state.relationship, favor: newFavor } };
        });
        if (!get().relationship) return;

        const updatedFavor = get().relationship?.favor ?? 0;

        // B-10: adjustFavor is the SOLE favor writer — mirror it onto the character (which recomputes
        // the blessing-driven maxHP/maxSP), so the two favor copies can never diverge.
        useCharacterStore.getState().setDeityFavor(updatedFavor);

        // Eviction: flag at the ABANDONED tier, and CLEAR it once favor recovers above it (B-10).
        if (updatedFavor <= FAVOR_STATUS.ABANDONED.max) {
          if (!get().isPatronEvicted) set({ isPatronEvicted: true });
        } else if (get().isPatronEvicted) {
          set({ isPatronEvicted: false });
        }

        // High-favor soul milestone (80+ — set to the actual favor value)
        if (updatedFavor >= 80) {
          useSoulStore.getState().setBehavementProgress('social_deity_favor_high', updatedFavor);
        }
        // Deity relic reveal at 100% favor
        if (updatedFavor >= 100) {
          const deityId = get().relationship?.deityId;
          if (deityId) useSacredItemStore.getState().recordMaxFavor(deityId, updatedFavor);
        }
        // Favoured Child tracking (91+)
        if (updatedFavor >= 91) {
          const deityId = get().relationship?.deityId;
          if (deityId) useSacredItemStore.getState().recordFavoredChild(deityId);
        }
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
        const floorsRemaining = get().relationship?.currentChallenge?.floorsRemaining;
        if (floorsRemaining === undefined) return;

        const newFloorsRemaining = floorsRemaining - 1;

        if (newFloorsRemaining <= 0) {
          set((state) =>
            state.relationship
              ? {
                  relationship: {
                    ...state.relationship,
                    challengesFailed: state.relationship.challengesFailed + 1,
                    currentChallenge: undefined,
                  },
                }
              : state
          );
          // B-10: favor via the single writer (syncs character + eviction).
          get().adjustFavor(calculateFavorChange('challenge_fail'), 'challenge_expiry');
        } else {
          set((state) =>
            state.relationship?.currentChallenge
              ? {
                  relationship: {
                    ...state.relationship,
                    currentChallenge: {
                      ...state.relationship.currentChallenge,
                      floorsRemaining: newFloorsRemaining,
                    },
                  },
                }
              : state
          );
        }
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
        const rel = get().relationship;
        if (!rel?.currentChallenge) return;

        const { challengeId } = rel.currentChallenge;
        const challenge = getDeityById(rel.deityId)?.challenges.find((c) => c.id === challengeId);
        const favorGain = challenge?.favorGain ?? calculateFavorChange('challenge_complete');

        set((state) =>
          state.relationship
            ? {
                relationship: {
                  ...state.relationship,
                  challengesCompleted: state.relationship.challengesCompleted + 1,
                  currentChallenge: undefined,
                },
                completedChallengeIds: [...state.completedChallengeIds, challengeId],
              }
            : state
        );
        // B-10: favor via the single writer (syncs character + eviction/milestones).
        get().adjustFavor(favorGain, 'challenge_complete');

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
            // B-10: target the reward at the BUILD's strongest stats (was a fixed STR/END/AGI/PER,
            // which wasted the reward for a CHA/INT/WIS/LCK build).
            const characterStore = useCharacterStore.getState();
            const eff = characterStore.getEffectiveStats();
            const topStats = (Object.keys(eff) as StatName[])
              .sort((a, b) => eff[b] - eff[a])
              .slice(0, 4);
            topStats.forEach((s) => characterStore.addPendingExcelia(s, pointsPerStat));
          }
        }
        // Soul: challenge completed
        useSoulStore.getState().incrementBehavement('glory_challenge_complete');
        void relationship; // suppress unused warning

        // Store reward details so Familia Home can display them on next visit
        const updatedState2 = get();
        const completedDeity = updatedState2.getPatronDeity();
        const lastId = updatedState2.completedChallengeIds[updatedState2.completedChallengeIds.length - 1];
        const completedChallenge = completedDeity?.challenges.find((c) => c.id === lastId);
        if (completedChallenge) {
          set({
            pendingChallengeReward: {
              challengeName: completedChallenge.name,
              favorGain: completedChallenge.favorGain ?? 15,
              bonusStatPoints: completedChallenge.bonusStatPoints ?? 0,
            },
          });
        }
      },

      failChallenge: () => {
        const rel = get().relationship;
        if (!rel?.currentChallenge) return;

        const { challengeId } = rel.currentChallenge;
        const challenge = getDeityById(rel.deityId)?.challenges.find((c) => c.id === challengeId);
        const favorLoss = challenge?.favorLoss ?? Math.abs(calculateFavorChange('challenge_fail'));

        set((state) =>
          state.relationship
            ? {
                relationship: {
                  ...state.relationship,
                  challengesFailed: state.relationship.challengesFailed + 1,
                  currentChallenge: undefined,
                },
              }
            : state
        );
        // B-10: favor via the single writer (syncs character + eviction).
        get().adjustFavor(-favorLoss, 'challenge_fail');
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

      recordChallengeEvent: (eventType, amount = 1) => {
        const { relationship } = get();
        if (!relationship?.currentChallenge) return;

        const deity = getDeityById(relationship.deityId);
        const challenge = deity?.challenges.find((c) => c.id === relationship.currentChallenge!.challengeId);
        if (!challenge) return;

        if (challenge.requirement.type === eventType) {
          get().updateChallengeProgress(amount);
        }
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

      claimChallengeReward: () => {
        set({ pendingChallengeReward: null });
      },

      evictPatron: () => {
        set({ relationship: null, isPatronEvicted: false });
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
    createVersionedPersist<DeityState>('kohrvellia-deity', 1)
  )
);
