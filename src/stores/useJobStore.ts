/**
 * Job / Class state store
 * Persisted via AsyncStorage — survives app restart.
 * Reset on new character creation.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Job } from '../types/Job';
import type { StatName } from '../types/Stats';
import { getJobsForStats, getJobById } from '../data/jobs';
import { useCharacterStore } from './useCharacterStore';

interface JobState {
  currentJobId: string | null;
  hasSelectedJob: boolean;

  // Derived — recomputed from currentJobId when needed
  getCurrentJob: () => Job | null;
  getAvailableJobsForTopStats: (topStats: [StatName, StatName, StatName]) => Job[];

  // Actions
  selectJob: (jobId: string) => void;
  reset: () => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      currentJobId: null,
      hasSelectedJob: false,

      getCurrentJob: () => {
        const { currentJobId } = get();
        return currentJobId ? (getJobById(currentJobId) ?? null) : null;
      },

      getAvailableJobsForTopStats: (topStats) => {
        return getJobsForStats(topStats);
      },

      selectJob: (jobId) => {
        const job = getJobById(jobId);
        if (!job) return;
        set({ currentJobId: jobId, hasSelectedJob: true });

        // Grant the starter skill to the character immediately
        const { learnSkill } = useCharacterStore.getState();
        const starterSkill = {
          ...job.starterSkill,
          currentCooldown: 0,
          proficiency: 0,
          timesUsed: 0,
          level: 1,
          observed: true,
          learned: true,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        learnSkill(starterSkill as any);
      },

      reset: () => {
        set({ currentJobId: null, hasSelectedJob: false });
      },
    }),
    {
      name: 'kohrvellia-job-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentJobId: state.currentJobId,
        hasSelectedJob: state.hasSelectedJob,
      }),
    }
  )
);
