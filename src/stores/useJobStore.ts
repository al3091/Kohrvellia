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
import { getJobsForStats, getJobById, getSpecializationsForJob } from '../data/jobs';
import { useCharacterStore } from './useCharacterStore';
import type { Skill } from '../types/Character';

interface JobState {
  currentJobId: string | null;
  hasSelectedJob: boolean;
  currentSpecializationId: string | null;

  // Derived — recomputed from currentJobId when needed
  getCurrentJob: () => Job | null;
  getAvailableJobsForTopStats: (topStats: [StatName, StatName, StatName]) => Job[];
  getAvailableSpecializations: () => Job[];

  // Actions
  selectJob: (jobId: string) => void;
  selectSpecialization: (specializationId: string) => void;
  reset: () => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      currentJobId: null,
      hasSelectedJob: false,
      currentSpecializationId: null,

      getCurrentJob: () => {
        const { currentJobId } = get();
        return currentJobId ? (getJobById(currentJobId) ?? null) : null;
      },

      getAvailableJobsForTopStats: (topStats) => {
        return getJobsForStats(topStats);
      },

      getAvailableSpecializations: () => {
        const { currentJobId } = get();
        if (!currentJobId) return [];
        return getSpecializationsForJob(currentJobId);
      },

      selectJob: (jobId) => {
        const job = getJobById(jobId);
        if (!job) return;
        set({ currentJobId: jobId, hasSelectedJob: true });

        // Grant the starter skill to the character immediately
        const charStore = useCharacterStore.getState();
        const { learnSkill } = charStore;
        const starterSkill: Skill = {
          ...job.starterSkill,
          currentCooldown: 0,
          proficiency: 0,
          timesUsed: 0,
          level: 1,
          observed: true,
          learned: true,
        };
        learnSkill(starterSkill);

        // Apply the job's permanent stat bonus to character stats
        charStore.applyJobStatBonus(job.statBonus.stat, job.statBonus.value);

        // Record current job on character object
        charStore.setCurrentJob({
          id: jobId,
          name: job.name,
          level: 1,
          skills: [job.starterSkill.id],
        });
      },

      selectSpecialization: (specializationId) => {
        // Find spec in all specializations
        const specs = get().getAvailableSpecializations();
        const spec = specs.find(s => s.id === specializationId);
        if (!spec) return;

        set({ currentSpecializationId: specializationId });

        // Grant specialization skill
        const charStore = useCharacterStore.getState();
        const specSkill: Skill = {
          ...spec.starterSkill,
          currentCooldown: 0,
          proficiency: 0,
          timesUsed: 0,
          level: 1,
          observed: true,
          learned: true,
        };
        charStore.learnSkill(specSkill);

        // Apply specialization stat bonus
        charStore.applyJobStatBonus(spec.statBonus.stat, spec.statBonus.value);
      },

      reset: () => {
        set({ currentJobId: null, hasSelectedJob: false, currentSpecializationId: null });
      },
    }),
    {
      name: 'kohrvellia-job-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentJobId: state.currentJobId,
        hasSelectedJob: state.hasSelectedJob,
        currentSpecializationId: state.currentSpecializationId,
      }),
    }
  )
);
