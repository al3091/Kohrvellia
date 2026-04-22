/**
 * Character Creation State Hook for Kohrvellia
 * Temporary Zustand store for the character creation wizard
 * NOT persisted - resets when app closes
 */

import { create } from 'zustand';
import type { BackstoryId } from '../types/Character';
import type { StatName } from '../types/Stats';

// Constants for stat allocation
export const STARTING_POINTS = 30;
export const MAX_PER_STAT = 20;
export const MIN_PER_STAT = 0;

// Default stat allocations (all zeros)
const DEFAULT_ALLOCATIONS: Record<StatName, number> = {
  STR: 0,
  PER: 0,
  END: 0,
  CHA: 0,
  INT: 0,
  AGI: 0,
  WIS: 0,
  LCK: 0,
};

interface CreationState {
  // Step 1: Name
  name: string;
  epithet: string;

  // Step 2: Backstory
  backstoryId: BackstoryId | null;

  // Step 3: Deity
  selectedPantheonId: string | null;
  selectedDeityId: string | null;

  // Step 4: Stat Allocation
  statAllocations: Record<StatName, number>;
  remainingPoints: number;

  // Step 5: Equipment Selection
  selectedWeaponId: string | null;

  // Actions
  setName: (name: string) => void;
  setEpithet: (epithet: string) => void;
  setBackstory: (id: BackstoryId) => void;
  setPantheon: (id: string) => void;
  setDeity: (id: string) => void;
  allocateStat: (stat: StatName, delta: number) => void;
  resetAllocations: () => void;
  setSelectedWeapon: (weaponId: string) => void;
  reset: () => void;

  // Navigation helpers
  goToStep: (step: number) => void;
  currentStep: number;
}

const initialState = {
  name: '',
  epithet: '',
  backstoryId: null as BackstoryId | null,
  selectedPantheonId: null as string | null,
  selectedDeityId: null as string | null,
  statAllocations: { ...DEFAULT_ALLOCATIONS },
  remainingPoints: STARTING_POINTS,
  selectedWeaponId: null as string | null,
  currentStep: 1,
};

export const useCreationState = create<CreationState>((set, get) => ({
  ...initialState,

  setName: (name) => set({ name }),

  setEpithet: (epithet) => set({ epithet }),

  setBackstory: (backstoryId) => set({ backstoryId }),

  setPantheon: (selectedPantheonId) => set({ selectedPantheonId }),

  setDeity: (selectedDeityId) => set({ selectedDeityId }),

  allocateStat: (stat, delta) => {
    const { statAllocations, remainingPoints } = get();
    const currentValue = statAllocations[stat];
    const newValue = currentValue + delta;

    // Validate bounds
    if (newValue < MIN_PER_STAT || newValue > MAX_PER_STAT) return;

    // Validate remaining points
    const newRemaining = remainingPoints - delta;
    if (newRemaining < 0 || newRemaining > STARTING_POINTS) return;

    set({
      statAllocations: {
        ...statAllocations,
        [stat]: newValue,
      },
      remainingPoints: newRemaining,
    });
  },

  resetAllocations: () =>
    set({
      statAllocations: { ...DEFAULT_ALLOCATIONS },
      remainingPoints: STARTING_POINTS,
    }),

  setSelectedWeapon: (selectedWeaponId) => set({ selectedWeaponId }),

  reset: () => set(initialState),

  goToStep: (currentStep) => set({ currentStep }),
}));

// Computed selectors
export function useCreationValidation() {
  const { name, epithet, backstoryId, selectedDeityId, remainingPoints, selectedWeaponId } =
    useCreationState();

  const isStep1Complete = name.trim().length >= 2 && epithet.trim().length >= 2;
  const isStep2Complete = backstoryId !== null;
  const isStep3Complete = selectedDeityId !== null;
  const isStep4Complete = remainingPoints === 0;
  const isStep5Complete = selectedWeaponId !== null;
  const canSubmit =
    isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete && isStep5Complete;

  return {
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    isStep5Complete,
    canSubmit,
  };
}

// Full title preview
export function useCharacterPreview() {
  const { name, epithet } = useCreationState();

  if (!name.trim()) {
    return '...';
  }

  const formattedEpithet = epithet.trim()
    ? epithet.startsWith('the ')
      ? epithet
      : `the ${epithet}`
    : '...';

  return `${name}, ${formattedEpithet}`;
}

export default useCreationState;
